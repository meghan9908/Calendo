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
import { useEffect, useMemo, useState } from "react";
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
    const daysInMonth = useMemo(() => Array.from({ length: lastDate }), [activeMonthDate]);

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
                    console.log(new Date(response.data?.[0].startTime),new Date(response.data?.[0].endTime));
                    setBusyTimeSlots(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching busy times:", error);
                })
                .finally(() => setIsLoading(false));
        }
    }, [selectedDate, username]);

    function isWithinBusySlot(time: Date) {
        const bookingFrom = time;
        const bookingTo = addMinutes(time, length);

        return busyTimeSlots.some((busySlot) => {
            const busyFrom = new Date(parseInt(busySlot.startTime)*1000);
            const busyTo = new Date(parseInt(busySlot.endTime)*1000);

            return (
                (isAfter(bookingFrom, busyFrom) && isBefore(bookingFrom, busyTo)) ||
                (isAfter(bookingTo, busyFrom) && isBefore(bookingTo, busyTo)) ||
                (isEqual(bookingFrom, busyFrom) && isEqual(bookingTo, busyTo))
            );
        });
    }

    function generateTimeSlots(from: string, to: string) {
        const fromTime = parse(from, "HH:mm", selectedDate as Date);
        const toTime = parse(to, "HH:mm", selectedDate as Date);

        if (fromTime >= toTime) return [];
        const slots: Date[] = [];
        let current = fromTime;

        while (current <= toTime) {
            slots.push(current);
            current = addMinutes(current, length);
        }

        return slots;
    }

    useEffect(() => {
        if (selectedDate) {
            const weekdayName = format(selectedDate, "EEEE") as Weekday;
            const weekdayConfig = bookingTimes?.[weekdayName];

            if (weekdayConfig?.active && weekdayConfig.From && weekdayConfig.To) {
                setTimeSlots(generateTimeSlots(weekdayConfig.From, weekdayConfig.To));
            } else {
                setTimeSlots(null);
            }
        }
    }, [selectedDate]);

    return (
        <div className="flex gap-4 py-4">
            {/* Calendar Section */}
            <div>
                <div className="flex items-center mb-4">
                    <span className="grow font-bold text-lg">
                        {format(activeMonthDate, "MMMM")} {activeYear}
                    </span>
                    <button
                        onClick={() => setActiveMonthDate((prev) => subMonths(prev, 1))}
                        disabled={activeMonthDate <= currentDate}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                        aria-label="Previous Month"
                    >
                        <ChevronLeft size={30}/>
                    </button>
                    <button
                        onClick={() => setActiveMonthDate((prev) => addMonths(prev, 1))}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Next Month"
                    >
                        <ChevronRight size={32}/>
                    </button>
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {short_days.map((day, index) => (
                        <span key={index} className="text-center font-medium text-gray-600">
                            {day}
                        </span>
                    ))}
                    {Array.from({ length: firstDate.getDay() }).map((_, index) => (
                        <div key={`empty-${index}`} />
                    ))}
                    {daysInMonth.map((_, index) => {
                        const day = new Date(activeYear, activeMonth, index + 1);
                        const weekdayConfig = bookingTimes?.[format(day, "EEEE") as Weekday];
                        const canBeBooked = weekdayConfig?.active && (isFuture(day) || isToday(day));
                        const isSelected = isEqual(day, selectedDate as Date);

                        return (
                            <button
                                key={index}
                                className={clsx(
                                    "w-8 h-8 rounded-full transition-all",
                                    canBeBooked ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-300",
                                    isToday(day) ? "border-2 border-blue-500" : "",
                                    isSelected ? "bg-blue-600 text-white" : ""
                                )}
                                onClick={() => canBeBooked && setSelectedDate(day)}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Time Selection Section */}
            <div className="p-4 bg-gray-100 rounded shadow w-64">
                <h3 className="font-bold mb-2">Available Times</h3>
                {isLoading ? (
                    <div className="flex justify-center text-center items-center"><BounceLoader className="mt-8" size={72} color="#3B82F6"/></div>
                ) : selectedDate && timeSlots ? (
                    <div className="gap-y-2">
                        {timeSlots.map((slot, index) => {
                            const isBusy = isWithinBusySlot(slot);
                            console.log("isBusy",isBusy);
                            return (
                                <Link
                                    key={index}
                                    href={isBusy ? "#" : `/${meetingUri}/${slot.toISOString()}`}
                                    className={clsx(
                                        "block py-2 mb-1 px-4 gap-2 rounded",
                                        isBusy
                                            ? "bg-gray-300 cursor-not-allowed"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    )}
                                    aria-disabled={isBusy}
                                    title={isBusy ? "This time slot is unavailable" : "Book this time"}
                                >
                                    {format(slot, "HH:mm")}
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-600">No available slots for this day.</p>
                )}
            </div>
        </div>
    );
}
