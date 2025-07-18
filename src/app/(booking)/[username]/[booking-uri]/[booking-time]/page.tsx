// src/app/(booking)/[username]/[booking-uri]/[booking-time]/page.tsx
'use client';

import axios from "axios";
import { format, isValid} from "date-fns";
import { FormEvent, useState } from "react";

type PageProps = {
  params: {
    username: string;
    "booking-uri": string;
    "booking-time": string;
  };
};

export default async function BookingFormPage({ params }: PageProps) {
  const { username, "booking-uri": bookingUri, "booking-time": rawTime } = await params;

  const rawBookingTime = decodeURIComponent(rawTime);
  const parsedTime = new Date(rawBookingTime);
  const bookingTime = isValid(parsedTime) ? parsedTime : null;

  if (bookingTime) {
    console.log("Booking Time (UTC):", rawBookingTime);
    console.log("Booking Time (Local):", format(bookingTime, "yyyy-MM-dd HH:mm:ss"));
  } else {
    console.error("Invalid booking time provided:", rawBookingTime);
  }

  // State variables
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestNotes, setGuestNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  async function handleFormSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!bookingTime) {
      alert("Invalid booking time. Please try again.");
      return;
    }

    const data = { guestName, guestEmail, guestNotes, username, bookingUri, bookingTime };
    try {
      await axios.post("/api/bookings", data);
      setConfirmed(true);
    } catch (error) {
      console.error("Booking failed:", error);
      alert("An error occurred while confirming your booking. Please try again.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="text-left p-8 w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-2xl text-gray-800 font-bold mb-6 pb-4 border-b border-gray-200">
          {bookingTime
            ? format(bookingTime, "EEEE, MMMM d, yyyy HH:mm") // Display in proper format
            : "Invalid Time"}
        </h2>
        {confirmed ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-gray-600">
              Thank you for your booking. You'll receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Your Name
              </label>
              <input
                value={guestName}
                onChange={(ev) => setGuestName(ev.target.value)}
                type="text"
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Your Email
              </label>
              <input
                value={guestEmail}
                onChange={(ev) => setGuestEmail(ev.target.value)}
                type="email"
                placeholder="test@example.com"
                className="w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Additional Information
              </label>
              <textarea
                value={guestNotes}
                onChange={(ev) => setGuestNotes(ev.target.value)}
                placeholder="Any relevant information (optional)"
                className="w-full border border-gray-300 rounded-xl shadow-sm p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                rows={4}
              />
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}