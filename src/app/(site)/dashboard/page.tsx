import DashboardNav from '@/app/components/dashboard_Nav';
import ProfileForm from '@/app/components/ProfileForm';
import { ProfileModel } from '@/app/models/profile';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("calendix_session");
  const email = await sessionCookie?.value; // Extract the email from the cookie value if it exists
  console.log("session email in dashboard", email);
  if (!email) {
    await redirect('/');
  }
  const ProfileDoc = await ProfileModel.findOne({email});
  return (
    <>
    <DashboardNav/>
    <ProfileForm existingUsername={ProfileDoc?.username as string} />
    </>
  )
}
