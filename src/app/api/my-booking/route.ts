import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function getDb() {
  await client.connect();
  return client.db("travelDB");
}

/** GET /api/my-booking — get bookings for the authenticated user (auth required) */
export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Token is missing an email claim" },
      { status: 401 },
    );
  }

  const authEmail = session.user.email;

  try {
    const db = await getDb();
    const result = await db
      .collection("bookings")
      .find({ "user.email": authEmail })
      .toArray();
    return NextResponse.json({ bookings: result }, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}
