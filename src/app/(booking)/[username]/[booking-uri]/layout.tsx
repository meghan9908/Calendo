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
        <body>
          <main>
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-2xl font-bold">Profile not found</h1>
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
      <body>
        <main>
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg overflow-hidden">
              {/* Event Details */}
              <div className="bg-blue-50 p-6 w-1/3">
                <h1 className="text-xl font-bold mb-4">{eventDoc?.title || "Event Not Found"}</h1>
                <p>{eventDoc?.description || "No description available"}</p>
              </div>
              {/* Page Content */}
              <div className="p-6 flex-grow">{children}</div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
