import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { ProfileModel } from "@/app/models/profile";
import { EventTypeModel } from "@/app/models/events";
import { BookingModel } from "@/app/models/booking";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore?.get("calendix_session");
    const email = sessionCookie?.value;
    console.log("[API_USER] Fetching user data for email:", email);
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await mongoose.connect(process.env.MONGODB_URI as string);

    // 1. Fetch Profile
    const profile = await ProfileModel.findOne({ email });
    if (!profile) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Fetch Event Types for user
    const eventTypes = await EventTypeModel.find({ email });
    const eventTypeIds = eventTypes.map((e) => e._id.toString());

    // 3. Count Bookings this Month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const meetingsThisMonth = await BookingModel.countDocuments({
      eventTypeId: { $in: eventTypeIds },
      when: { $gte: startOfMonth, $lte: now },
    });

    // 4. Time saved (25 mins per booking)
    const timesSaved = parseFloat((meetingsThisMonth * 0.25).toFixed(1)); // hours
    console.log("[API_USER] User data fetched successfully:", {
      name: profile.username || email.split("@")[0],
      plan: "Pro", // can be updated to dynamic later
      meetingsThisMonth,
      timesSaved,
    });

    return NextResponse.json({
      name: profile?.username || email.split("@")[0],
      plan: "Pro", // can be updated to dynamic later
      meetingsThisMonth,
      timesSaved,
    });
  } catch (error) {
    console.error("[API_USER_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
