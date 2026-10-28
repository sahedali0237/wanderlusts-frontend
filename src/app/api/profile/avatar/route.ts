import { requireSession } from "@/lib/api-auth";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs";
import { join } from "path";
import { promisify } from "util";

const writeFileAsync = promisify(writeFile);
const mkdirAsync = promisify(mkdir);

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("travelDB");

export async function PATCH(req: Request) {
  try {
    const session = await requireSession();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    const userId = user.id;
    const userEmail = user.email;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image must be smaller than 5MB" },
        { status: 400 }
      );
    }

    // Save file to public/uploads
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdirAsync(uploadsDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${userId}-${Date.now()}-${file.name.replace(
      /[^a-zA-Z0-9.-]/g,
      "_"
    )}`;
    const filePath = join(uploadsDir, filename);

    await writeFileAsync(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    // Update user's image in database
    await db
      .collection("user")
      .updateOne({ email: userEmail }, { $set: { image: imageUrl } });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload avatar" },
      { status: 500 }
    );
  }
}