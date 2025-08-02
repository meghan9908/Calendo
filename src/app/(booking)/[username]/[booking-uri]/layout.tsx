import mongoose from "mongoose";
import { ReactNode } from "react";
import { ProfileModel } from "@/app/models/profile";
import { EventTypeModel } from "@/app/models/events";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ username: string; "booking-uri": string }>;
};

export default async function Layout({ children, params }: LayoutProps) {
  // Connect to the database
  await mongoose.connect(process.env.MONGODB_URI as string);

  // Resolve the params promise
  const resolvedParams = await params;

  // Fetch profile document based on the username
  const profileDoc = await ProfileModel.findOne({ username: resolvedParams.username });
  if (!profileDoc) {
    return (
      <html lang="en">
        <body className="bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
          <main className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Profile Not Found</h1>
              <p className="text-gray-600 max-w-md mx-auto">
                The profile you're looking for doesn't exist or may have been removed.
              </p>
            </div>
          </main>
        </body>
      </html>
    );
  }

  // Fetch event document based on profile email and booking URI
  const eventDoc = await EventTypeModel.findOne({
    email: profileDoc.email,
    uri: resolvedParams?.["booking-uri"],
  });

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen font-sans">
        <main className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20">
              <div className="flex flex-col lg:flex-row min-h-[600px]">
                {/* Event Details Sidebar */}
                <div className="lg:w-2/5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-8 text-white relative overflow-hidden">
                  {/* Background decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    {eventDoc ? (
                      <div className="space-y-6">
                        <div>
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Event Details
                          </div>
                          <h1 className="text-3xl font-bold mb-3 leading-tight">
                            {eventDoc.title}
                          </h1>
                        </div>
                        
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                          <h3 className="font-semibold text-white/90 mb-3 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Description
                          </h3>
                          <p className="text-blue-100 leading-relaxed">
                            {eventDoc.description}
                          </p>
                        </div>

                        {/* Additional event metadata */}
                        <div className="space-y-3 pt-4 border-t border-white/20">
                          <div className="flex items-center text-blue-100">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">Hosted by {profileDoc.username}</span>
                          </div>
                          <div className="flex items-center text-blue-100">
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Duration: {eventDoc.duration || 30} minutes</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-2">Event Not Found</h2>
                          <p className="text-blue-100">
                            The requested event could not be located.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:w-5/6 flex flex-col">
                  <div className="flex-grow p-8 lg:p-12">
                    <div className="h-full flex flex-col">
                      {children}
                    </div>
                  </div>
                  
                  {/* Footer */}
                  <div className="px-8 lg:px-12 py-6 bg-gray-50/50 border-t border-gray-200/50">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 space-y-2 sm:space-y-0">
                      <p>© 2025 Booking System. All rights reserved.</p>
                      <div className="flex space-x-4">
                        <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
                        <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}