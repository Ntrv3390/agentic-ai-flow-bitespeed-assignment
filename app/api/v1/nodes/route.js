import { PrismaClient } from "@/app/generated/prisma";
import { ALLOWED_INPUT_TYPES } from "@/constants/inputsArray";

const prisma = new PrismaClient(); // created a new prisma client to contact database

export async function GET() {
  // GET method to get available nodes
  try {
    const nodes = await prisma.nodeType.findMany(); // find all types of available nodes
    return Response.json(nodes); // returns all types of nodes to the cliend
  } catch {
    return Response.json({ error: "Internal Server Error" }, { status: 500 }); // return a server error if anything goes wrong
  }
}

export async function POST(request) {
  // POST method to add a type of node. Type remains unique here
  try {
    const body = await request.json(); // get the body from the request
    const { name, type, inputTypes } = body;

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

    if (!name) {
      return Response.json({ error: "Name is required" }, { status: 400 });
    }

    if (!type) {
      return Response.json({ error: "Type is required" }, { status: 400 });
    }

    const node = await prisma.nodeType.create({
      data: { name, type }, // create a type node and insert in db
    });

    return Response.json(node, { status: 201 }); // return the node with success status code
  } catch (error) {
    if (error.code === "P2002" && error.meta?.target?.includes("type")) {
      // handling duplicate data errors
      return Response.json({ error: "Type must be unique" }, { status: 409 });
    }
    if (error.code === "P2002" && error.meta?.target?.includes("name")) {
      return Response.json({ error: "Name must be unique" }, { status: 409 });
    }
    return Response.json({ error: "Internal Server Error" }, { status: 500 }); // return a server error if anything goes wrong
  }
}
