import DashboardNav from "@/app/components/dashboard_Nav";
import {BookingModel} from "@/app/models/booking";
import {EventTypeModel} from "@/app/models/events"
import {format} from "date-fns";
import {Calendar, CircleUser, NotepadText, Clock, MapPin, ExternalLink, Filter, Search, TrendingUp, Users} from "lucide-react";
import mongoose from "mongoose";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("calendix_session");
  const email = sessionCookie?.value;
  
  const eventTypeDocs = await EventTypeModel.find({email});
  const bookedEvents = await BookingModel.find({
    eventTypeId: eventTypeDocs.map(doc => doc._id),
  }, {}, {sort: 'when'});

  // Calculate stats
  const totalBookings = bookedEvents.length;
  const upcomingBookings = bookedEvents.filter(booking => new Date(booking.when) > new Date()).length;
  const uniqueGuests = new Set(bookedEvents.map(booking => booking.guestEmail)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      <DashboardNav/>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Manage your bookings and track your schedule</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                <ExternalLink className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{upcomingBookings}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Unique Guests</p>
                  <p className="text-2xl font-bold text-gray-900">{uniqueGuests}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50/80 to-blue-50/30 border-b border-gray-200/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Recent Bookings</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {bookedEvents.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">When people book your events, they'll appear here.</p>
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Share Your Link
                </button>
              </div>
            ) : (
              bookedEvents.map((booking, index) => {
                const eventTypeDoc = eventTypeDocs
                  .find(etd => (etd._id as string).toString() === booking.eventTypeId);
                
                const isUpcoming = new Date(booking.when) > new Date();
                const isPast = new Date(booking.when) < new Date();
                
                return (
                  <div
                    key={booking._id}
                    className={`px-6 py-5 hover:bg-gray-50/50 transition-colors group ${
                      index === 0 ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start space-x-4">
                          <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                            isUpcoming ? 'bg-green-400' : isPast ? 'bg-gray-300' : 'bg-blue-400'
                          }`} />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-3">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {eventTypeDoc?.title || 'Unknown Event'}
                              </h3>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                isUpcoming ? 'bg-green-100 text-green-800' : 
                                isPast ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {isUpcoming ? 'Upcoming' : isPast ? 'Completed' : 'Today'}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <CircleUser className="w-4 h-4 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <span className="font-medium text-gray-900">{booking.guestName}</span>
                                  <span className="ml-2 text-gray-500 truncate">{booking.guestEmail}</span>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                <span className="font-medium">
                                  {format(booking?.when as Date, 'MMM d, yyyy')}
                                </span>
                                <Clock className="w-4 h-4 flex-shrink-0 ml-2" />
                                <span>
                                  {format(booking?.when as Date, 'HH:mm')}
                                </span>
                              </div>
                            </div>
                            
                            {booking.guestNotes && (
                              <div className="mt-3 flex items-start space-x-2">
                                <NotepadText className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                                <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-lg border-l-3 border-blue-200">
                                  "{booking.guestNotes}"
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center space-x-2 lg:ml-4">
                        <button className="inline-flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors opacity-0 group-hover:opacity-100">
                          View Details
                        </button>
                        {isUpcoming && (
                          <button className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-sm font-medium text-blue-700 hover:bg-blue-100 transition-colors">
                            <MapPin className="w-3 h-3 mr-1" />
                            Join
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          {bookedEvents.length > 0 && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-200/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {bookedEvents.length} booking{bookedEvents.length !== 1 ? 's' : ''}
                </p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                  View All Bookings →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}