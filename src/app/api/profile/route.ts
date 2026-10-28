import { requireSession } from "@/lib/api-auth";
import { MongoClient } from "mongodb";
import { connection, NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("travelDB");

export async function GET() {
  // Read the session (and therefore headers()) only at request time. Without
  // this, Next.js tries to prerender the handler at build time and aborts the
  // pending headers() call, which this handler would otherwise catch and log.
  await connection();

  try {
    const session = await requireSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    const userEmail = user.email;

    const dbUser = await db.collection("user").findOne({ email: userEmail });

    // Fetch bookings for this user to compute dynamic stats
    const bookings = await db
      .collection("bookings")
      .find({ "user.email": userEmail })
      .toArray();

    const totalBookings = bookings.length;
    const countriesVisited = new Set(
      bookings.map((b) => b.destination?.country).filter(Boolean)
    ).size;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingTrips = bookings.filter(
      (b) => new Date(b.departureDate) >= today
    ).length;
    const totalSpent = bookings.reduce((sum, b) => {
      const price = Number(String(b.price ?? "").replace(/[^0-9.]/g, ""));
      return sum + (Number.isFinite(price) ? price : 0);
    }, 0);

    return NextResponse.json({
      name: user.name ?? "",
      email: user.email ?? "",
      image: dbUser?.image ?? user.image ?? "",
      memberSince: dbUser?.memberSince
        ? new Date(dbUser.memberSince).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : user.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })
          : "Mar 2024",
      nationality: dbUser?.nationality ?? "United States",
      stats: {
        totalBookings,
        countriesVisited,
        upcomingTrips,
        totalSpent: `$${totalSpent.toLocaleString("en-US")}`,
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}