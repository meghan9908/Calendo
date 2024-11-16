import DashboardNav from '@/app/components/dashboard_Nav';
import ProfileForm from '@/app/components/ProfileForm';
import { session } from '@/app/libs/session';
import { ProfileModel } from '@/app/models/profile';
import mongoose from 'mongoose';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const email = await session()?.get("email");
  if (!email) {
    redirect('/');
  }
  const ProfileDoc = await ProfileModel.findOne({email});
  return (
    <>
    <DashboardNav/>
    <ProfileForm existingUsername={ProfileDoc?.username as string} />
    </>
  )
}
