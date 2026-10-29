import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function getDb() {
  await client.connect();
  return client.db("travelDB");
}

/** GET /api/destination/:id — get a single destination (public) */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Destination ID format" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.collection("destinations").findOne({
      _id: new ObjectId(id),
    });

    if (!result) {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("MongoDB query error:", error);
    return NextResponse.json(
      { message: "Failed to retrieve destination", error: (error as Error).message },
      { status: 500 },
    );
  }
}

/** PATCH /api/destination/:id — update a destination (auth required) */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: `Invalid Destination ID: ${id}` },
        { status: 400 },
      );
    }

    const body = await req.json();
    const { _id, ...updateData } = body;

    const db = await getDb();
    const result = await db.collection("destinations").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Destination updated successfully",
      result,
    });
  } catch (error) {
    console.error("MongoDB update error:", error);
    return NextResponse.json(
      { message: "Failed to update destination", error: (error as Error).message },
      { status: 500 },
    );
  }
}

/** DELETE /api/destination/:id — delete a destination (auth required) */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: _req.headers });
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: `Invalid Destination ID: ${id}` },
        { status: 400 },
      );
    }

    const db = await getDb();
    const result = await db.collection("destinations").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Destination not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Destination deleted successfully",
      result,
    });
  } catch (error) {
    console.error("MongoDB delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete destination", error: (error as Error).message },
      { status: 500 },
    );
  }
}
