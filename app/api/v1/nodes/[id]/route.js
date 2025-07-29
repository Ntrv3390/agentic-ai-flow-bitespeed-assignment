import { PrismaClient } from "@/app/generated/prisma";
import { ALLOWED_INPUT_TYPES } from "@/constants/inputsArray";

const prisma = new PrismaClient(); // created a new prisma client to contact database

export async function GET(_, { params }) {
  try {
    const { id } = await params;

    // First try to find by ID
    let node = await prisma.nodeType.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        inputTypes: true,
      },
    });

    // If not found by ID, try finding by type
    if (!node) {
      node = await prisma.nodeType.findUnique({
        where: { type: id }, // fallback to type match
        select: {
          id: true,
          name: true,
          type: true,
          inputTypes: true,
        },
      });
    }

    if (!node) {
      return Response.json({ error: "Node not found" }, { status: 404 });
    }

    return Response.json(node, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  // PUT method to update a given node
  try {
    const { id } = params; // get id to find one from URL params
    const body = await request.json();
    const { name, type, inputTypes } = body; // destructuring body for updated details

    if (!Array.isArray(inputTypes)) {
      // validating the inputTypes
      return Response.json(
        { error: "Input types must be an array" },
        { status: 400 }
      );
    }

    const invalid = inputTypes.some(
      (type) => !ALLOWED_INPUT_TYPES.includes(type)
    );

    if (invalid) {
      return Response.json(
        { error: "One or more input types are invalid" },
        { status: 400 }
      );
    }

    if (!name || !type) {
      return Response.json(
        { error: "Name and type are required" },
        { status: 400 }
      ); // return a bad request if required data is missing
    }

    const existing = await prisma.nodeType.findUnique({ where: { id } }); // check if node with given id exists
    if (!existing) {
      return Response.json({ error: "Node not found" }, { status: 404 }); // return not found if no such node exists
    }

    const node = await prisma.nodeType.update({
      // updating the node and saving it in db
      where: { id },
      data: { name, type },
    });

    return Response.json(node, { status: 200 }); // returning the updated node with success status
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      error.meta?.target?.includes("type")
    ) {
      return Response.json({ error: "Type must be unique" }, { status: 409 }); // return erro if type exists
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 }); // return a server error if anything goes wrong
  }
}

export async function DELETE(_, { params }) {
  // DELETE method to delete a node
  try {
    const { id } = params; // get id to find one from URL params

    const existing = await prisma.nodeType.findUnique({ where: { id } }); // check if node with given id exists
    if (!existing) {
      return Response.json({ error: "Node not found" }, { status: 404 }); // return not found if no such node exists
    }

    await prisma.nodeType.delete({
      // deleting the node from db
      where: { id },
    });

    return Response.json({ message: "Deleted successfully" }, { status: 200 }); // returning a success response
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 }); // return a server error if anything goes wrong
  }
}
