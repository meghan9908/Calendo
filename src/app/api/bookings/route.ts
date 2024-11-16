import { BookingModel } from "@/app/models/booking";
import { EventTypeModel } from "@/app/models/events";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { nylas } from "@/app/libs/nylas";
import { addMinutes } from "date-fns";

export async function POST(req: NextRequest) {
    try {
        // Parse the JSON request body
        const data = await req.json();

        // Ensure the MongoDB connection
        if (!mongoose.connection.readyState) {
            await mongoose.connect(process.env.MONGODB_URI ?? 'No URL');
        }

        // Find the profile and event type documents
        const profileDoc = await ProfileModel.findOne({ username: data?.username });
        const etDoc = await EventTypeModel.findOne({
            uri: data?.bookingUri,
            email: profileDoc?.email
        });

        if (!etDoc || !profileDoc) {
            return NextResponse.json({ error: "Invalid URL or event type not found" }, { status: 404 });
        }

        // Parse the booking time
        const startTime = new Date(data.bookingTime);
        const endTime = addMinutes(startTime ,etDoc.duration);
        const timeZone = 'Asia/Kolkata'; // Replace with your desired time zone
        // Create a booking record in the database
        const bookingData = {
            ...data,
            eventTypeId: etDoc._id,
            when:data.bookingTime,
        };
        const booking = await BookingModel.create(bookingData);

        // Schedule the event via Nylas API
        try {
            const event = await nylas.events.create({
                identifier: process.env.NYLAS_GRANT_ID as string,
                requestBody: {
                    title: etDoc.title,
                    when: {
                        startTimezone:timeZone,
                        endTimezone:timeZone,
                        startTime:startTime.getTime(),
                        endTime: endTime.getTime(),
                    },
                    conferencing: {
                        autocreate: {},
                        provider: 'Google Meet',
                    },
                    participants: [
                        {
                            name: data.guestName as string,
                            email: data.guestEmail as string,
                            status: 'yes',
                        },
                    ],
                },
                queryParams: {
                    calendarId: etDoc.email as string,
                },
            });

            console.log("Event created:", event);
        } catch (eventError) {
            console.error("Error creating Nylas event:", eventError);
        }

        // Return a successful response
        return NextResponse.json({ success: true, booking }, { status: 201 });
    } catch (error) {
        console.error("Error handling booking POST request:", error);
        return NextResponse.json(
            { error: "An error occurred while processing the booking." },
            { status: 500 }
        );
    }
}
