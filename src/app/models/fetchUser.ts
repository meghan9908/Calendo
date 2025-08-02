// lib/models/fetchUser.ts
import { ProfileModel } from "./profile";
import { EventTypeModel } from "./events";
import { BookingModel } from "./booking";
import mongoose from "mongoose";
import { cookies } from "next/headers";

type UserType = {
  name: string;
  plan: string;
  meetingsThisMonth: number;
  timesSaved: number;
};

export default async function fetchUserData(): Promise<UserType | null> {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("calendix_session");
    const email = await sessionCookie?.value; // Extract the email from the cookie value if it exists
    if (!email) return null; // If no email found, return null
    await mongoose.connect(process.env.MONGODB_URI as string);
    // 1. Get the user's profile
    const profile = await ProfileModel.findOne({ email });
    if (!profile) return null;

    // 2. Get all event types owned by this user
    const eventTypes = await EventTypeModel.find({ email });
    const eventTypeIds = eventTypes.map(event => event._id.toString());

        // 3. Get current month's bookings across those event types
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const meetingsThisMonth = await BookingModel.countDocuments({
          eventTypeId: { $in: eventTypeIds },
          when: { $gte: startOfMonth, $lte: now },
        });

        // 4. Estimate time saved (e.g., 25 mins saved per booking)
        const timesSaved = parseFloat((meetingsThisMonth * 0.25).toFixed(1)); // in hours

        return {
          name: profile.username || email.split("@")[0], // fallback if username missing
          plan: "Pro", // static plan unless stored elsewhere
          meetingsThisMonth,
          timesSaved,
        };
    }
