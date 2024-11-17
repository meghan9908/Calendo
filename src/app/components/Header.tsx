/* eslint-disable @next/next/no-page-custom-font */
/* eslint-disable @next/next/google-font-display */
"use server";
import Link from "next/link";
import { session } from "@/app/libs/session";

export default async function Header() {
    const sessionData = await session()
    const email =await sessionData && await sessionData?.get('email');
    console.log("session_email_header", email);
    return (    
        <header className="flex gap-6 text-gray-light justify-between mx-10 py-2">
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=event_note" />
            <div className="flex items-center gap-4">
                <Link href="/" className="text-blue-600 flex gap-4 text-2xl items-center font-bold">
                    <span className="material-symbols-outlined text-4xl text-blue-600">event_note</span>
                    Calendo
                </Link>

                <nav className="flex gap-4">
                    <Link href="/features">Features</Link>
                    <Link href="/about">About</Link>
                    <Link href="/pricing">Pricing</Link>
                </nav>
            </div>

            {email ? (
                
                <div>
                    <nav className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-white font-bold bg-blue-600 px-3 p-3 rounded-full">Dashboard</Link>
                        <Link href="/api/logout" className="p-3">Log Out</Link>
                    </nav>
                </div>
            ) : (
                <div>
                    <nav className="flex items-center gap-4">
                        <Link href="/api/auth" className="p-3">Sign In</Link>
                        <Link href="/api/auth" className="text-white font-bold bg-blue-600 px-3 p-3 rounded-full">Get Started</Link>
                    </nav>
                </div>
            )}
        </header>
    );
}
