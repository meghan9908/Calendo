//Timepicker.tsx
'use client';

import {
    addMinutes,
    addMonths,
    endOfDay,
    format,
    isAfter,
    isBefore,
    isEqual,
    isFuture,
    isToday,
    lastDayOfMonth,
    parse,
    startOfDay,
    subMonths,
} from "date-fns";
import clsx from "clsx";
import Link from "next/link";
import axios from "axios";
import { useEffect, useMemo, useState, useCallback } from "react";
import { TimeSlot } from "nylas";
import { short_days } from "../libs/shared";
import { BookingType, Weekday } from "../libs/type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BounceLoader } from "react-spinners";

export default function TimePicker({
    bookingTimes,
    username,
    meetingUri,
    length,
}: {
    bookingTimes: BookingType;
    username: string;
    meetingUri: string;
    length: number;
}) {
    console.log("bookingTimes", bookingTimes);
    const currentDate = new Date();
    const [activeMonthDate, setActiveMonthDate] = useState(currentDate);
    const [selectedDate, setSelectedDate] = useState<null | Date>(null);
    const [timeSlots, setTimeSlots] = useState<null | Date[]>(null);
    const [busyTimeSlots, setBusyTimeSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const activeMonth = activeMonthDate.getMonth();
    const activeYear = activeMonthDate.getFullYear();
    const firstDate = new Date(activeYear, activeMonth, 1);
    const lastDate = lastDayOfMonth(activeMonthDate).getDate();
    const daysInMonth = useMemo(() => Array.from({ length: lastDate }), [lastDate]);

    // Memoize the generateTimeSlots function to prevent recreation on every render
    const generateTimeSlots = useCallback((from: string, to: string, selectedDate: Date) => {
        const fromTime = parse(from, "HH:mm", selectedDate);
        const toTime = parse(to, "HH:mm", selectedDate);

        if (fromTime >= toTime) return [];
        const slots: Date[] = [];
        let current = fromTime;

        while (current <= toTime) {
            slots.push(current);
            current = addMinutes(current, length);
        }

        return slots;
    }, [length]);

    useEffect(() => {
        if (selectedDate) {
            setIsLoading(true);
            const params = new URLSearchParams();
            params.set("username", username);
            params.set("from", startOfDay(selectedDate).toISOString());
            params.set("to", endOfDay(selectedDate).toISOString());

            axios
                .get(`/api/busy?${params.toString()}`)
                .then((response) => {
                    console.log(new Date(response.data?.[0]?.startTime), new Date(response.data?.[0]?.endTime));
                    setBusyTimeSlots(response.data || []);
                })
                .catch((error) => {
                    console.error("Error fetching busy times:", error);
                    setBusyTimeSlots([]);
                })
                .finally(() => setIsLoading(false));
        }
    }, [selectedDate, username]);

    const isWithinBusySlot = useCallback((time: Date) => {
        const bookingFrom = time;
        const bookingTo = addMinutes(time, length);

        return busyTimeSlots.some((busySlot) => {
            const busyFrom = new Date(parseInt(busySlot.startTime) * 1000);
            const busyTo = new Date(parseInt(busySlot.endTime) * 1000);

            return (
                (isAfter(bookingFrom, busyFrom) && isBefore(bookingFrom, busyTo)) ||
                (isAfter(bookingTo, busyFrom) && isBefore(bookingTo, busyTo)) ||
                (isEqual(bookingFrom, busyFrom) && isEqual(bookingTo, busyTo))
            );
        });
    }, [busyTimeSlots, length]);

    useEffect(() => {
        if (selectedDate) {
            const weekdayName = format(selectedDate, "EEEE") as Weekday;
            const weekdayConfig = bookingTimes?.[weekdayName];

            if (weekdayConfig?.active && weekdayConfig.From && weekdayConfig.To) {
                setTimeSlots(generateTimeSlots(weekdayConfig.From, weekdayConfig.To, selectedDate));
            } else {
                setTimeSlots(null);
            }
        }
    }, [selectedDate, bookingTimes, generateTimeSlots]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 py-6 px-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
            {/* Calendar Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex-1 max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                        {format(activeMonthDate, "MMMM")} {activeYear}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setActiveMonthDate((prev) => subMonths(prev, 1))}
                            disabled={activeMonthDate <= currentDate}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                            aria-label="Previous Month"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>
                        <button
                            onClick={() => setActiveMonthDate((prev) => addMonths(prev, 1))}
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                            aria-label="Next Month"
                        >
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                    {short_days.map((day, index) => (
                        <span key={index} className="text-center font-semibold text-gray-500 text-sm py-2">
                            {day}
                        </span>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: firstDate.getDay() }).map((_, index) => (
                        <div key={`empty-${index}`} className="w-10 h-10" />
                    ))}
                    {daysInMonth.map((_, index) => {
                        const day = new Date(activeYear, activeMonth, index + 1);
                        const weekdayConfig = bookingTimes?.[format(day, "EEEE") as Weekday];
                        const canBeBooked = weekdayConfig?.active && (isFuture(day) || isToday(day));
                        const isSelected = selectedDate && isEqual(day, selectedDate);

                        return (
                            <button
                                key={index}
                                className={clsx(
                                    "w-10 h-10 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
                                    canBeBooked 
                                        ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 shadow-sm hover:shadow-md" 
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed",
                                    isToday(day) ? "ring-2 ring-blue-400 ring-opacity-60" : "",
                                    isSelected ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700 border-blue-600" : ""
                                )}
                                onClick={() => canBeBooked && setSelectedDate(day)}
                                disabled={!canBeBooked}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selection Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex-1 max-w-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Available Times</h3>
                    {selectedDate && (
                        <div className="text-sm text-gray-500 font-medium">
                            {format(selectedDate, "MMM d, yyyy")}
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="text-center">
                            <BounceLoader size={48} color="#3B82F6" />
                            <p className="text-gray-500 mt-4 text-sm">Loading available slots...</p>
                        </div>
                    </div>
                ) : selectedDate && timeSlots ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                        {timeSlots.length > 0 ? (
                            timeSlots.map((slot, index) => {
                                const isBusy = isWithinBusySlot(slot);
                                console.log("isBusy", isBusy);
                                return (
                                    <Link
                                        key={index}
                                        href={
                                            isBusy
                                                ? "#"
                                                : `/booking/${username}/${meetingUri}/${(slot.toISOString())}`
                                        }
                                        className={clsx(
                                            "block py-3 px-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 text-center",
                                            isBusy
                                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg focus:ring-blue-500 border border-blue-600"
                                        )}
                                        aria-disabled={isBusy}
                                        title={isBusy ? "This time slot is unavailable" : "Book this time"}
                                        onClick={(e) => isBusy && e.preventDefault()}
                                    >
                                        <div className="flex items-center justify-center space-x-2">
                                            <span>{format(slot, "HH:mm")}</span>
                                            {isBusy && (
                                                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
                                                    Busy
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-gray-400 text-4xl mb-2">📅</div>
                                <p className="text-gray-500">No available slots for this day.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-300 text-6xl mb-4">🗓️</div>
                        <p className="text-gray-500 text-lg">Select a date to view available times</p>
                        <p className="text-gray-400 text-sm mt-2">Choose from the calendar on the left</p>
                    </div>
                )}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f5f9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
            `}</style>
        </div>
    );
}