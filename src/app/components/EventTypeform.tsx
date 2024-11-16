"use client";
import { useEffect, useState } from "react";
import Timestamps from "../(site)/dashboard/dashboard-events/timeStamps";
import { BookingType, eventType, Weekday } from "../libs/type";
import clsx from "clsx";
import axios from "axios";
import { useRouter } from "next/navigation";
import EventDeletion from "./event_deletion";
import { weekdays } from "../libs/shared";

export default function EventTypeForm({ doc }: { doc?: eventType }) {
    const [title, setTitle] = useState(doc?.title || '');
    const [description, setDescription] = useState(doc?.description || '');
    const [duration, setDuration] = useState(doc?.duration || 30);
    const [username, setUsername] = useState("");
    const router = useRouter();

    const [isChecked, setIsChecked] = useState<Record<Weekday, boolean>>({
        Monday: doc?.bookingTime?.Monday?.active || false,
        Tuesday: doc?.bookingTime?.Tuesday?.active || false,
        Wednesday: doc?.bookingTime?.Wednesday?.active || false,
        Thursday: doc?.bookingTime?.Thursday?.active || false,
        Friday: doc?.bookingTime?.Friday?.active || false,
        Saturday: doc?.bookingTime?.Saturday?.active || false,
        Sunday: doc?.bookingTime?.Sunday?.active || false,
    });

    const initializebookingTime = () => ({
        Monday: { From: "", To: "", active: false },
        Tuesday: { From: "", To: "", active: false },
        Wednesday: { From: "", To: "", active: false },
        Thursday: { From: "", To: "", active: false },
        Friday: { From: "", To: "", active: false },
        Saturday: { From: "", To: "", active: false },
        Sunday: { From: "", To: "", active: false },
    });

    const [bookingTime, setbookingTime] = useState<BookingType>(doc?.bookingTime || initializebookingTime());

    useEffect(() => {
        async function fetchUsername() {
            try {
                const response = await axios.get("/api/profile");
                const data = response.data;
                if (data.hasUsername) {
                    setUsername(data.username);
                }
            } catch (error) {
                console.error("Failed to fetch username:", error);
            }
        }

        fetchUsername();
    }, []);

    console.log("Fetched username:", username);

    const handleCheckboxChange = (day: Weekday) => {
        const newCheckedState = !isChecked[day];
        setIsChecked((prevStates) => ({
            ...prevStates,
            [day]: newCheckedState,
        }));

        setbookingTime((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                active: newCheckedState,
                ...(newCheckedState ? {} : { From: "", To: "" }),
            },
        }));
    };

    const handlebookingTime = (day: Weekday, val: string, fromOrto: 'From' | 'To') => {
        if (isChecked[day]) {
            setbookingTime((prevbookingTime) => ({
                ...prevbookingTime,
                [day]: {
                    ...prevbookingTime[day],
                    [fromOrto]: val,
                    active: true,
                },
            }));
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const filteredBookingTime = Object.fromEntries(
            Object.entries(bookingTime).filter(
                ([,{ active }]) => active
            )
        );

        const data = { title, description, duration, bookingTime: filteredBookingTime };

        try {
            const id = doc?._id;
            const req = id ? axios.put : axios.post;

            const response = await req('/api/event-types', { ...data, id });
            if (response.data) {
                router.push('/dashboard/dashboard-events');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
                <p className="text-md font-semibold text-gray-400  my-4 mb-2">URI:http://localhost:3000/{username}/{doc?.uri}</p>
                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        <span>Title:</span>
                        <input
                            type="text"
                            placeholder="Event title"
                            className="mt-2 w-full p-3 border rounded-lg focus:outline-blue-500"
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                        />
                    </label>
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        <span>Description:</span>
                        <textarea
                            placeholder="Description of the meeting"
                            className="mt-2 w-full p-3 border rounded-lg h-32 focus:outline-blue-500"
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        <span>Duration (Minutes):</span>
                        <input
                            type="number"
                            className="mt-2 w-full p-3 border rounded-lg focus:outline-blue-500"
                            placeholder="Duration of event"
                            min="15"
                            max="120"
                            value={duration}
                            onChange={ev => setDuration(parseInt(ev.target.value))}
                        />
                    </label>
                </div>

                <div className="col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        <span>Availability:</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                        {weekdays.map((day) => {
                            const isAvailable = isChecked[day] && (bookingTime[day]?.From < bookingTime[day].To || !bookingTime[day]?.From || !bookingTime[day]?.To);

                            return (
                                <div key={day} className={clsx("flex items-center gap-4", isAvailable ? '' : 'opacity-50')}>
                                    <input
                                        type="checkbox"
                                        id={day}
                                        checked={isChecked[day]}
                                        onChange={() => handleCheckboxChange(day)}
                                        className="h-8 w-4 text-blue-600 accent-blue-400"
                                        aria-label={`Toggle availability for ${day}`}
                                    />
                                    <label htmlFor={day} className="text-gray-700 font-medium capitalize">
                                        {day}
                                    </label>
                                    <div className={clsx("flex gap-2 items-center m-2", isAvailable ? '' : 'pointer-events-none')}>
                                        <Timestamps steps={30} value={bookingTime[day]?.From} onChange={(val) => handlebookingTime(day, val, 'From')} />
                                        <span>-</span>
                                        <Timestamps steps={30} value={bookingTime[day]?.To} onChange={(val) => handlebookingTime(day, val, 'To')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="col-span-2 flex text-center justify-center mt-6">
                    <div className="col-span-3 text-center mr-3 my-3">
                        <button type="submit" className="btn-blue" aria-label="Save event details">
                            Save Event
                        </button>
                    </div>
                    {doc?._id && (
                        <EventDeletion id={doc._id} />
                    )}
                </div>
            </form>
        </>
    );
}
