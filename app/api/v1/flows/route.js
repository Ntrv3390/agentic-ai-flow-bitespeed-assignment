import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const flows = await prisma.flow.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(flows, { status: 200 });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name: rawName, nodes = [], edges = [] } = body;

    const baseName = rawName || "New Flow";
    let uniqueName = baseName;
    let counter = 1;

    while (await prisma.flow.findUnique({ where: { name: uniqueName } })) {
      uniqueName = `${baseName}-${counter++}`;
    }

    // Create flow
    const flow = await prisma.flow.create({
      data: { name: uniqueName },
    });

    // Create nodes and build map from frontendId to DB node
    const frontendIdToDbNode = {};

    const createdNodes = await Promise.all(
      nodes.map(async (node) => {
        const created = await prisma.flowNode.create({
          data: {
            flowId: flow.id,
            typeId: node.nodeTypeData.id,
            positionX: node.position.x,
            positionY: node.position.y,
            data: node.data?.text ?? null,
          },
        });
        frontendIdToDbNode[node.id] = created;
        return created;
      })
    );

    // Create edges using DB node IDs and also saving flowId
    const createdEdges = await Promise.all(
      edges.map((edge) => {
        const source = frontendIdToDbNode[edge.source];
        const target = frontendIdToDbNode[edge.target];

        if (!source || !target) return null;

        return prisma.edge.create({
          data: {
            flowId: flow.id, // ✅ NEW
            sourceId: source.id,
            targetId: target.id,
          },
        });
      })
    );

    return Response.json(
      {
        message: "Flow created successfully",
        flow,
        nodes: createdNodes,
        edges: createdEdges.filter(Boolean),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/v1/flows error:", err);
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
