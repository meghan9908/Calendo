"use server";
import DashboardNav from "@/app/components/dashboard_Nav";
import { session } from "@/app/libs/session";
import { connect } from "mongoose";
import { EventTypeModel } from "@/app/models/events";
import Link from "next/link";
import { Plus } from "lucide-react";
import { eventType, Weekday } from "@/app/libs/type";

export default async function Events() {
    await connect(process.env.MONGODB_URI ?? "no link");
    const email = await session()?.get("email");

    const EventTypes: eventType[] = await EventTypeModel.find({ email });
    return (
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-200 min-h-screen">
            <DashboardNav />
            <h2 className="text-4xl font-bold text-blue-700 mb-6 text-center">My Events</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {EventTypes.map((et, index) => (
                    <div key={index} className="relative w-full h-64 perspective">
                        <div className="flip-card-inner relative w-full h-full transition-transform duration-500 transform-style-preserve-3d hover:rotate-y-180">
                            {/* Front Side */}
                            <div className="flip-card-front bg-white p-6 rounded-xl shadow-lg absolute w-full h-full backface-hidden flex flex-col justify-center">
                                <h3 className="text-2xl font-bold text-blue-600 mb-1">{et.title}</h3>
                                <p className="text-sm text-gray-500">Organizer: <span className="font-medium text-gray-700">{et.email}</span></p>
                                <p className="text-gray-400 text-xs">
                                    Created on: <span className="font-medium">{new Date(et.createdAt).toLocaleString()}</span>
                                </p>
                                <div className="mt-4">
                                    <h4 className="font-semibold text-lg text-blue-500 mb-2">Availability:</h4>
                                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                                        const timeData = et.bookingTime[day as Weekday];
                                        return timeData?.active ? (
                                            <div key={day} className="flex justify-between items-center text-sm mb-1">
                                                <span className="font-medium text-gray-600">{day}</span>
                                                <span className="text-gray-600">
                                                    {timeData.From} - {timeData.To}
                                                </span>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                            </div>

                            {/* Back Side */}
                            <div className="flip-card-back bg-blue-600 text-white p-6 rounded-xl shadow-lg absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center">
                                <div className="overflow-hidden  mb-4"><p className="text-lg" >{et.description}</p></div>
                                <Link
                                    className="inline-flex gap-2 items-center bg-white text-blue-600 rounded-full px-4 py-2 mt-4 hover:bg-gray-100 transition-colors duration-200"
                                    href={`/dashboard/dashboard-events/edit/${et._id}`}
                                >
                                    <Plus size={18} />
                                    Edit Event
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-8">
                <Link
                    className="inline-flex gap-2 items-center bg-green-500 text-white rounded-full px-6 py-3 hover:bg-green-600 transition-colors duration-200 shadow-md"
                    href="/dashboard/dashboard-events/new"
                >
                    <Plus size={20} />
                    New Event Type
                </Link>
            </div>
        </div>
    );
}
