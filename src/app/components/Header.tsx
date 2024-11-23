import Link from "next/link";
import { getSession } from "@/app/libs/session";

export default async function Header() {
  const sessionStore = await getSession(); // Use the helper function
  const email = await sessionStore?.get('email'); // Retrieve the email
  console.log("Session email in Header.tsx:", email);

  return (
    <header className="flex gap-6 text-gray-light justify-between mx-10 py-2">
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
