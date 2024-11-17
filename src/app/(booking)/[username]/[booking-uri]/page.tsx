import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/app/models/events";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";

type PageProps = {
  params: Promise<{
    username: string;
    "booking-uri": string;
  }>;
};

export default async function BookingPage({ params }: PageProps) {
  // Resolve params from the promise
  const { username, "booking-uri": bookingUri } = await params;

  // Connect to the database
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Failed to connect to the database:{error as string}</h1>
      </div>
    );
  }

  // Fetch profile document
  const profileDoc = await ProfileModel.findOne({ username });
  if (!profileDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  // Fetch event type document
  const eventDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: bookingUri,
  });
  if (!eventDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <TimePicker
        bookingTimes={eventDoc.bookingTime || []} // Ensure it's an array
        length={eventDoc.duration || 0} // Default to 0 if undefined
        username={username}
        meetingUri={bookingUri}
      />
    </div>
  );
}
