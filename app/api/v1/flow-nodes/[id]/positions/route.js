import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { positionX, positionY } = await request.json();

    if (typeof positionX !== "number" || typeof positionY !== "number") {
      return Response.json(
        { error: "Both positionX and positionY must be numbers" },
        { status: 400 }
      );
    }

    const updated = await prisma.flowNode.update({
      where: { id },
      data: { positionX, positionY },
    });

    return Response.json(updated, { status: 200 });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}