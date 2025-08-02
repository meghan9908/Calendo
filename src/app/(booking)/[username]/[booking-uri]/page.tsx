import TimePicker from "@/app/components/TimePicker";
import { EventTypeModel } from "@/app/models/events";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
  };
};

// Helper function to clean MongoDB data and remove ObjectIds
function cleanBookingTimes(bookingTime: any) {
  if (!bookingTime || typeof bookingTime !== 'object') {
    return {};
  }

  // Convert to plain object and remove MongoDB-specific fields
  const cleaned = JSON.parse(JSON.stringify(bookingTime));
  delete cleaned._id;
  delete cleaned.__v;
  
  // Ensure each day's configuration is properly structured
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const cleanedBookingTimes: any = {};
  days.forEach(day => {
    if (cleaned[day]) {
      cleanedBookingTimes[day] = {
        active: Boolean(cleaned[day].active),
        From: String(cleaned[day].From || ''),
        To: String(cleaned[day].To || '')
      };
    }
  });
  
  return cleanedBookingTimes;
}

export default async function BookingPage({ params }: PageProps) {
  try {
    // Resolve params from the promise
    const { username, "booking-uri": bookingUri } = await params;
    console.log("Booking Page Params:", { username, bookingUri });

    // Connect to the database
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI as string);

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

    // Clean the booking times to remove MongoDB ObjectIds and ensure proper structure
    const cleanedBookingTimes = cleanBookingTimes(eventDoc.bookingTime);
    
    console.log("Cleaned booking times:", cleanedBookingTimes);

    return (
      <div className="min-h-screen flex items-center justify-center">
        <TimePicker
          bookingTimes={cleanedBookingTimes}
          length={eventDoc.duration || 30}
          username={username}
          meetingUri={bookingUri}
        />
      </div>
    );
  } catch (error) {
    console.error("Booking page error:", error);
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
        </div>
      </div>
    );
  }
}