import { nylas, nylasConfig } from "@/app/libs/nylas";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Received callback from Nylas");

  const url = new URL(req.url ?? "");
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response("No Authorization code returned from Nylas", { status: 400 });
  }

  const response = await nylas.auth.exchangeCodeForToken({
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId, // Note this is *different* from your API key
    redirectUri: nylasConfig.callbackUri, // URI you registered with Nylas in the previous step
    code,
  });

  const { grantId, email } = response;

  if (!email) {
    return new Response("Failed to retrieve email from Nylas", { status: 400 });
  }

  await mongoose.connect(process.env.MONGODB_URI ?? "No URL");

  const profileDoc = await ProfileModel.findOne({ email });
  if (profileDoc) {
    profileDoc.grantId = grantId;
    await profileDoc.save();
  } else {
    await ProfileModel.create({ email, grantId });
  }

  // Set session cookie
  const cookieStore = cookies();
  (await cookieStore).set({
    name: "calendix_session",
    value: email,
    maxAge: 86400, // 24 hours in seconds
    path: "/", // Cookie accessible across the app
    httpOnly: true, // Prevent client-side JavaScript access
    secure: true, // Only send over HTTPS
    sameSite: "strict", // Restrict third-party usage
  });

  console.log("Session set with email:", email);

  // Redirect to the home page or another appropriate route
  await redirect("/redirect");

}
