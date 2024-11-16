import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { nylas } from "@/app/libs/nylas";
import { TimeSlot } from "nylas";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const username = url.searchParams.get('username');
    const from = new Date(url.searchParams.get('from') as string);
    const to = new Date(url.searchParams.get('to') as string);

    await mongoose.connect(process.env.MONGODB_URI as string);
    const profileDoc = await ProfileModel.findOne({ username });
    if (!profileDoc) {
        return new Response('Invalid username and/or booking URI', { status: 404 });
    }

    try {
        const calendar = await nylas.calendars.getFreeBusy({
            identifier: profileDoc.grantId as string,
            requestBody: {
                startTime: Math.round(from.getTime() / 1000),
                endTime: Math.round(to.getTime() / 1000),
                emails: [profileDoc.email as string]
            }
        });
        console.log('Calendar:', calendar);

        if (calendar?.data?.[0]) {
            // @ts-expect-error: Type mismatch due to potential incorrect typings in the Nylas SDK for `timeSlots`.
            const slots = calendar.data?.[0]?.timeSlots as TimeSlot[];

            // @ts-expect-error: `status` property may not be correctly typed in the `TimeSlot` interface from Nylas SDK.
            const busySlots = slots?.filter((slot) => slot.status === 'busy');
            return new Response(JSON.stringify(busySlots), { status: 200 });
        }
    } catch (error) {
        console.error('Error to create calendar:', error);
        return new Response('Error to create calendar', { status: 404 });
    }
}
