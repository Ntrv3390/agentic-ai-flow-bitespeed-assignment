import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { data } = await request.json();

    if (typeof data !== "string") {
      return Response.json({ error: "Data must be a string" }, { status: 400 });
    }

    const updated = await prisma.flowNode.update({
      where: { id },
      data: { data },
    });

    return Response.json(updated, { status: 200 });
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}