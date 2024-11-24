import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);

        // Get email from session
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("calendix_session");
        const email = sessionCookie?.value; // Extract the email from the cookie value if it exists

        console.log("email", email);
        if (!email) {
            return NextResponse.json({ hasUsername: false, username: null }, { status: 401 });
        }

        // Look up the user profile by email
        const profile = await ProfileModel.findOne({ email });
        const hasUsername = !!profile?.username;

        return NextResponse.json({
            hasUsername,
            username: hasUsername ? profile.username : null
        }, { status: 200 });

    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({ hasUsername: false, username: null }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    console.log("updating..............");
    try {
        // Parse request body
        const body = await req.json();
        const { username } = body;

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI as string);

        // Get email from session
        const cookieStore = cookies();
        const sessionCookie = (await cookieStore).get("calendix_session");
        const email = sessionCookie?.value; // Extract the email from the cookie value if it exists
  
        if (!email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Find the profile document or create a new one
        let profileDoc = await ProfileModel.findOne({ email });
        if (profileDoc) {
            profileDoc.username = username;
            await profileDoc.save();
        } else {
            profileDoc = await ProfileModel.create({ email, username });
        }

        // Return updated profile document as JSON
        return NextResponse.json({ profileDoc });
    } catch (error) {
        console.error("Error updating profile:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
