import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const flow = await prisma.flow.findUnique({
      where: { id },
      include: {
        nodes: {
          include: { type: true },
        },
      },
    });

    if (!flow) {
      return Response.json({ error: "Flow not found" }, { status: 404 });
    }

    const allEdges = await prisma.edge.findMany({
      include: {
        source: true,
        target: true,
      },
    });

    const flowEdges = allEdges.filter((edge) => edge.source.flowId === id);

    return Response.json(
      {
        id: flow.id,
        name: flow.name,
        nodes: flow.nodes,
        edges: flowEdges,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET flow error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  const { id } = params;

  try {
    const flow = await prisma.flow.findUnique({ where: { id } }); // get the flow with id

    if (!flow) {
      return Response.json({ error: "Flow not found" }, { status: 404 });
    }

    const flowNodes = await prisma.flowNode.findMany({
      // get all flow nodes
      where: { flowId: id },
      select: { id: true },
    });

    const flowNodeIds = flowNodes.map((node) => node.id);

    await prisma.edge.deleteMany({
      // delete all the edges associated with flowNode
      where: {
        OR: [
          { sourceId: { in: flowNodeIds } },
          { targetId: { in: flowNodeIds } },
        ],
      },
    });

    await prisma.flowNode.deleteMany({
      // delete all flowNodes
      where: { flowId: id },
    });

    await prisma.flow.delete({ where: { id } }); // delete the flow

    return Response.json(
      // return success
      { message: "Flow deleted successfully" },
      { status: 200 }
    );
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 }); // return general error
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, nodes = [], edges = [] } = body;

    if (!id) {
      return Response.json({ error: "Flow ID is required" }, { status: 400 });
    }

    // Check flow exists
    const existingFlow = await prisma.flow.findUnique({
      where: { id: id },
    });
    if (!existingFlow) {
      return Response.json({ error: "Flow not found" }, { status: 404 });
    }

    if (name && name !== existingFlow.name) {
      let baseName = name;
      let uniqueName = baseName;
      let counter = 1;

      while (
        await prisma.flow.findFirst({
          where: {
            name: uniqueName,
            NOT: { id: id },
          },
        })
      ) {
        uniqueName = `${baseName}-${counter++}`;
      }

      await prisma.flow.update({
        where: { id: id },
        data: { name: uniqueName },
      });
    }

    // Remove all existing nodes and edges of the flow
    await prisma.edge.deleteMany({ where: { flowId: id } });
    await prisma.flowNode.deleteMany({ where: { flowId: id } });

    // Recreate nodes
    const frontendIdToDbNode = {};

    const createdNodes = await Promise.all(
      nodes.map(async (node) => {
        const created = await prisma.flowNode.create({
          data: {
            flowId: id,
            typeId: node.typeId || node.nodeTypeData?.id,
            positionX: node.position.x,
            positionY: node.position.y,
            data: node.data?.text ?? null,
          },
        });
        frontendIdToDbNode[node.id] = created;
        return created;
      })
    );

    // Recreate edges
    const createdEdges = await Promise.all(
      edges.map((edge) => {
        const source = frontendIdToDbNode[edge.source];
        const target = frontendIdToDbNode[edge.target];
        if (!source || !target) return null;

        return prisma.edge.create({
          data: {
            flowId: id,
            sourceId: source.id,
            targetId: target.id,
          },
        });
      })
    );

    return Response.json(
      {
        message: "Flow updated successfully",
        flowId: id,
        nodes: createdNodes,
        edges: createdEdges.filter(Boolean),
      },
      { status: 200 }
    );
  } catch (err) {
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
