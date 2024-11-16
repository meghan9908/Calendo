import { Clock, Info } from "lucide-react";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "@/app/globals.css";
import { EventTypeModel } from "@/app/models/events";
import { ProfileModel } from "@/app/models/profile";
import mongoose from "mongoose";
import { ReactNode } from "react";

const noto = Noto_Sans({ subsets: ["latin"], weight: ["200", "400", "600", "800"] });

export const metadata: Metadata = {
    title: "Calendo",
    description: "Generated by create next app",
};

type PageProps = {
    children:ReactNode,
    params: {
        username: string;
        "booking-uri": string;
        time: string;
    };
};

export default async function RootLayout(pageProps: PageProps) {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI as string);
    const params = await pageProps?.params;

    // Fetch the profile document based on username
    const profileDoc = await ProfileModel.findOne({ username:params?.username });
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

    // Fetch the event type document based on profile email and booking URI
    const eventDoc = await EventTypeModel.findOne({
        email: profileDoc.email,
        uri: params["booking-uri"],
    });
    // Render the main layout if both documents are found
    return (
        <html lang="en">
            <body className={`${noto.className} antialiased`}>
                <main>
                    <div
                        className="flex items-center justify-center min-h-screen bg-cover"
                        style={{
                            backgroundImage: "url('/background.jpg')",
                            backgroundRepeat: "repeat",
                        }}
                    >
                        <div className="w-full">
                            <div className="flex bg-red-50 max-w-4xl mx-auto shadow-lg rounded-2xl overflow-hidden">
                                {/* Event Details Section */}
                                <div className="bg-blue-100/50 p-8 w-64">
                                    <h1 className="text-2xl mb-4 font-bold border-b-2 border-black/10">
                                        {eventDoc.title}
                                    </h1>
                                    <div className="grid gap-y-4 grid-cols-[40px_1fr] py-2">
                                        <div>
                                            <Clock />
                                        </div>
                                        <div>{eventDoc.duration} minutes</div>
                                        <div>
                                            <Info />
                                        </div>
                                        <div className="max-h-96 overflow-hidden text-sm text-gray-700">
                                            {eventDoc.description || "No description available"}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="grow text-center px-8 pt-8">
                                    {pageProps?.children}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </body>
        </html>
    );

}