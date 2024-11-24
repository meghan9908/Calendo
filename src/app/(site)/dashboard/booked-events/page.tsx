import DashboardNav from "@/app/components/dashboard_Nav";
import {BookingModel} from "@/app/models/booking";
import {EventTypeModel} from "@/app/models/events"
import {format} from "date-fns";
import {Calendar, CircleUser, NotepadText} from "lucide-react";
import mongoose from "mongoose";
import { cookies } from "next/headers";


export default async function DashboardPage() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("calendix_session");
  const email = sessionCookie?.value; // Extract the email from the cookie value if it exists
  const eventTypeDocs = await EventTypeModel.find({email});
  const bookedEvents = await BookingModel.find({
    eventTypeId: eventTypeDocs.map(doc =>  doc._id),
  }, {}, {sort: 'when'});
  return (
    <>
      <DashboardNav/>
      <div className="mt-8">
        {bookedEvents.map(booking => {
          const eventTypeDoc = eventTypeDocs
            .find(etd => (etd._id as string).toString() === booking.eventTypeId);
          return (
            <div
              key={booking._id}
              className="p-4 border-b bg-gray-100">
              <h3 className="text-lg font-semibold text-gray-700">
                {eventTypeDoc?.title}
              </h3>
              <div className="flex gap-2 items-center my-1">
                <CircleUser size="16"/>
                <span>{booking.guestName}</span>
                <span className="text-gray-500">{booking.guestEmail}</span>
              </div>
              <div className="flex gap-2 items-center my-1">
                <Calendar size="16"/>
                <span>
                  {format(booking?.when as Date, 'EEEE, MMMM d, HH:mm')}
                </span>
              </div>
              <div className="flex gap-2 items-center my-1">
                <NotepadText size="16"/>
                <span>
                  {booking.guestNotes}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}