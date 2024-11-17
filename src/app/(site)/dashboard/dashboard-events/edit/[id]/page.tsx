import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/app/models/events";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";

type PageProps = {
  params: Promise<{
    username: string;
    "booking-uri": string;
  }>;
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
};

export default async function BookingPage({ params }: PageProps) {
  // Resolve params from the promise
  const { username, "booking-uri": bookingUri } = await params;

  // Connect to the database
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Fetch the profile document
  const profileDoc = await ProfileModel.findOne({ username });
  if (!profileDoc) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold">Profile not found</h1>
      </div>
    );
  }

  // Fetch the event type document
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
    <TimePicker
      bookingTimes={JSON.parse(JSON.stringify(eventDoc.bookingTime))}
      length={eventDoc.duration}
      username={username}
      meetingUri={bookingUri}
    />
  );
}
