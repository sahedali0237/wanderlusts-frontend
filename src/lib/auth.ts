import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

const MONGODB_URI = process.env.MONGODB_URI;
const BETTER_AUTH_SECRET = process.env.BETTER_AUTH_SECRET;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not set. Add it to your Vercel project settings → Environment Variables, then redeploy.",
  );
}
if (!BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Add it to your Vercel project settings → Environment Variables, then redeploy.",
  );
}

const client = new MongoClient(MONGODB_URI);
const db = client.db("travelDB");

export const auth = betterAuth({
    secret: BETTER_AUTH_SECRET,
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    plugins: [
        jwt(),
    ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: "jwt",
            maxAge: 7 * 24 * 60 * 60,
        }

    }
});