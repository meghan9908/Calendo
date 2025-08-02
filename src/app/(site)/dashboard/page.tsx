import DashboardNav from '@/app/components/dashboard_Nav';
import ProfileForm from '@/app/components/ProfileForm';
import { ProfileModel } from '@/app/models/profile';
import { EventTypeModel } from '@/app/models/events';
import { BookingModel } from '@/app/models/booking';
import mongoose from 'mongoose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User, Settings, Link2, Calendar, TrendingUp, ExternalLink, Shield, Bell } from 'lucide-react';

export default async function Dashboard() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("calendix_session");
  const email = await sessionCookie?.value;
  
  console.log("session email in dashboard", email);
  if (!email) {
    await redirect('/');
  }
  
  const profileDoc = await ProfileModel.findOne({email});
  
  // Fetch additional data for profile insights
  const eventTypes = await EventTypeModel.find({email});
  const bookings = await BookingModel.find({
    eventTypeId: { $in: eventTypes.map(et => et._id) }
  });
  
  const totalEvents = eventTypes.length;
  const totalBookings = bookings.length;
  const profileCompletion = calculateProfileCompletion(profileDoc);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <DashboardNav/>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your personal information and booking preferences</p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Public Profile
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Link2 className="w-4 h-4 mr-2" />
                Copy Profile Link
              </button>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Profile</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xl font-bold text-gray-900">{profileCompletion}%</p>
                    <span className="text-xs text-gray-500">Complete</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Event Types</p>
                  <p className="text-xl font-bold text-gray-900">{totalEvents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-xl font-bold text-gray-900">{totalBookings}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Shield className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Account</p>
                  <p className="text-sm font-bold text-green-600">Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Profile Form */}
          <div className="xl:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-b border-gray-200/50">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  Profile Information
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Update your personal details and booking preferences
                </p>
              </div>
              
              <div className="p-6">
                <ProfileForm existingUsername={profileDoc?.username as string} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Profile Strength
              </h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion</span>
                    <span className="font-medium">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                      style={{width: `${profileCompletion}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">✓ Basic Info</span>
                    <span className="text-green-600 font-medium">Complete</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">✓ Username</span>
                    <span className={profileDoc?.username ? "text-green-600" : "text-orange-500"}>
                      {profileDoc?.username ? "Complete" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">✓ Event Types</span>
                    <span className={totalEvents > 0 ? "text-green-600" : "text-orange-500"}>
                      {totalEvents > 0 ? "Complete" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Manage Events</p>
                      <p className="text-sm text-gray-500">Create and edit your event types</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </button>
                
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">View Bookings</p>
                      <p className="text-sm text-gray-500">Check your upcoming appointments</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </button>
                
                <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notifications</p>
                      <p className="text-sm text-gray-500">Configure email preferences</p>
                    </div>
                    <Bell className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                  </div>
                </button>
              </div>
            </div>

            {/* Profile Link Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-sm p-6 text-white">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Link2 className="w-5 h-5 mr-2" />
                Your Profile Link
              </h3>
              
              <div className="bg-white/20 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono break-all text-blue-100">
                  calendix.com/{profileDoc?.username || 'your-username'}
                </p>
              </div>
              
              <button className="w-full bg-white/20 hover:bg-white/30 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate profile completion
function calculateProfileCompletion(profileDoc: any): number {
  if (!profileDoc) return 20; // Base completion for having an account
  
  let completion = 20; // Base score
  
  if (profileDoc.username) completion += 30;
  if (profileDoc.fullName) completion += 20;
  if (profileDoc.bio) completion += 15;
  if (profileDoc.avatar) completion += 15;
  
  return Math.min(completion, 100);
}