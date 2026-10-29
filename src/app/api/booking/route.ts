import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function getDb() {
  await client.connect();
  return client.db("travelDB");
}

/** POST /api/booking — create a booking (auth required) */
export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Token is missing an email claim" },
      { status: 401 },
    );
  }

  const authEmail = session.user.email;
  const data = await req.json();

  // Prevent creating bookings for another user
  if (
    data.user?.email &&
    data.user.email.toLowerCase() !== authEmail.toLowerCase()
  ) {
    return NextResponse.json(
      { error: "You can only create bookings for your own account" },
      { status: 403 },
    );
  }

  // Always bind the booking to the authenticated user
  data.user = { ...(data.user ?? {}), email: authEmail };

  try {
    const db = await getDb();
    const result = await db.collection("bookings").insertOne(data);
    return NextResponse.json(
      { message: "Booking created successfully!", insertedId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error inserting booking:", error);
    return NextResponse.json(
      { message: "Failed to process booking" },
      { status: 500 },
    );
  }
}
