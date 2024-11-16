'use client';

import axios from "axios";
import { format, isValid, parseISO } from "date-fns";
import { FormEvent, useState } from "react";
import { use } from "react";

type PageProps = {
  params: Promise<{
    username: string;
    "booking-uri": string;
    "booking-time": string;
  }>;
};

export default function BookingFormPage(props: PageProps) {
  // Unwrap params
  const params = use(props.params);

  // Extract parameters
  const username = params.username;
  const bookingUri = params["booking-uri"];

  // Decode and parse the booking time
  const rawBookingTime = decodeURIComponent(params["booking-time"]);
  const parsedTime = new Date(rawBookingTime);

  // Ensure valid booking time
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
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="text-left p-8 w-full max-w-md bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-gray-700 font-bold mb-6 pb-2 border-b border-gray-200">
          {bookingTime
            ? format(bookingTime, "EEEE, MMMM d, yyyy HH:mm") // Display in proper format
            : "Invalid Time"}
        </h2>
        {confirmed ? (
          <div className="text-center text-green-600 font-semibold">
            🎉 Thank you for your booking!
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <label className="block">
              <span className="font-medium text-gray-600">Your Name</span>
              <input
                value={guestName}
                onChange={(ev) => setGuestName(ev.target.value)}
                type="text"
                placeholder="John Doe"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block">
              <span className="font-medium text-gray-600">Your Email</span>
              <input
                value={guestEmail}
                onChange={(ev) => setGuestEmail(ev.target.value)}
                type="email"
                placeholder="test@example.com"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </label>
            <label className="block">
              <span className="font-medium text-gray-600">Additional Information</span>
              <textarea
                value={guestNotes}
                onChange={(ev) => setGuestNotes(ev.target.value)}
                placeholder="Any relevant information (optional)"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </label>
            <div className="text-right">
              <button
                type="submit"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-700 transition-all duration-200 ease-in-out"
              >
                Confirm
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
