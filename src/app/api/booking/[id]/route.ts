import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { MongoClient, ObjectId } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI as string);

async function getDb() {
  await client.connect();
  return client.db("travelDB");
}

/** DELETE /api/booking/:id — delete a booking (auth required, owner only) */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Token is missing an email claim" },
      { status: 401 },
    );
  }

  const authEmail = session.user.email;
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json(
      { message: `Invalid Booking ID: ${id}` },
      { status: 400 },
    );
  }

  try {
    const db = await getDb();
    const booking = await db.collection("bookings").findOne({
      _id: new ObjectId(id),
    });

    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 },
      );
    }

    if (booking.user?.email?.toLowerCase() !== authEmail.toLowerCase()) {
      return NextResponse.json(
        { message: "Forbidden: You cannot delete someone else's booking" },
        { status: 403 },
      );
    }

    await db.collection("bookings").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("MongoDB delete error:", error);
    return NextResponse.json(
      { message: "Failed to delete booking", error: (error as Error).message },
      { status: 500 },
    );
  }
}
