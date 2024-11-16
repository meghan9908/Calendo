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

export default async function BookingPage(props: PageProps) {
  const  params  =await props?.params;
  await mongoose.connect(process.env.MONGODB_URI as string);
  const ProfileDoc = await ProfileModel?.findOne({
    username: params?.username,
  });
  if (!ProfileDoc) {
    return 404;
  }
  const etDoc = await EventTypeModel?.findOne({
    email: ProfileDoc?.email,
    uri: params?.["booking-uri"],
  });
  return (
    <TimePicker 
    bookingTimes={JSON.parse(JSON.stringify(etDoc.bookingTime))}
    length={etDoc.duration}
    username={params?.username}
    meetingUri={params?.["booking-uri"]}/>
  );
}
