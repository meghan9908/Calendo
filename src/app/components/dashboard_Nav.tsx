'use client';
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardNav() {
    const [hasUsername, setHasUsername] = useState(false);
    const pathname = usePathname();
    const isEvent = pathname.includes('dashboard-events');
    const isBooked = pathname.includes('booked-events');

    // Fetch username availability from the API
    async function checkUsername() {
        try {
            const response = await axios.get("/api/profile/");
            console.log(response.data);

            setHasUsername(response.data);
        } catch (error) {
            console.error("Failed to check username:", error);
        }
    }

    useEffect(() => {
        checkUsername();
    }, []); // Only run on mount

    return (
        <div className="flex justify-center gap-8 mt-6">
            <Link href="/dashboard" className={clsx("border border-gray rounded-full px-4 py-3", !(isBooked || isEvent) ? "bg-blue-600 text-white" : "bg-gray-200")}>
                Profile
            </Link>
            {hasUsername ? (
                <>
                    <Link href="/dashboard/booked-events" className={clsx("border border-gray rounded-full px-4 py-3", isBooked ? "bg-blue-600 text-white" : "bg-gray-200")}>
                        Booked Events
                    </Link>
                    <Link href="/dashboard/dashboard-events" className={clsx("border border-gray rounded-full px-4 py-3", isEvent ? "bg-blue-600 text-white" : "bg-gray-200")}>
                        Events Type
                    </Link>
                </>
            ) : null}
        </div>
    );
}
