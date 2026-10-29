import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function getDb() {
  await client.connect();
  return client.db("travelDB");
}

/** GET /api/destination — list all destinations (public) */
export async function GET() {
  try {
    const db = await getDb();
    const result = await db.collection("destinations").find().toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("MongoDB query error:", error);
    return NextResponse.json(
      { message: "Failed to retrieve destinations", error: (error as Error).message },
      { status: 500 },
    );
  }
}

/** POST /api/destination — create a destination (auth required) */
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const db = await getDb();
    const result = await db.collection("destinations").insertOne(body);
    return NextResponse.json(
      { message: "Data saved successfully!", insertedId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("MongoDB insert error:", error);
    return NextResponse.json(
      { message: "Failed to save data", error: (error as Error).message },
      { status: 500 },
    );
  }
}
