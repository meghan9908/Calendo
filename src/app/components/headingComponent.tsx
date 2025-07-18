'use client';
import Link from 'next/link';

export default function HeadingComponent() {
    return (
        <div
            data-testid="heading-component"
            className="flex flex-col items-center text-center mt-16 px-4 space-y-12"
        >
            {/* Title Section */}
            <div className="max-w-3xl">
                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
                    Calendo makes scheduling simple
                </h2>
            </div>

            {/* Description Section */}
            <div className="max-w-2xl">
                <p className="text-gray-600 text-lg md:text-xl mb-6">
                    Calendo is the go-to platform for professionals, teams, and enterprises looking to simplify their scheduling. With seamless integrations, automated workflows, and world-class security, Calendo powers productivity at scale.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link
                        href="/signup"
                        className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-lg"
                    >
                        Sign up for free
                    </Link>
                    <Link
                        href="/features"
                        className="bg-transparent border border-blue-600 text-blue-600 py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-600 hover:text-white transition duration-300"
                    >
                        Learn More
                    </Link>
                </div>
            </div>

            {/* Mission and Vision Section */}
            <div className="max-w-4xl space-y-8">
                <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
                        Our Mission
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        To empower individuals and organizations to connect effortlessly, saving time and creating more opportunities for meaningful interactions.
                    </p>
                </div>
                <div>
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
                        Our Vision
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        To be the world’s leading scheduling platform, fostering seamless collaboration and revolutionizing how people manage their time.
                    </p>
                </div>
            </div>

            {/* Expanded Commercial Details Section */}
            <div className="max-w-5xl space-y-8">
                <h3 className="text-2xl md:text-3xl font-semibold text-slate-800">
                    Why Professionals Choose Us
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed">
                    Trusted by <strong>50,000+</strong> businesses globally, Calendo ensures effortless scheduling for teams of all sizes. From Fortune 500 companies to startups, we enable efficient time management while enhancing client relationships.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                    With advanced features like group scheduling, round-robin meeting distribution, and automated reminders, Calendo reduces manual efforts by <strong>75%</strong> and boosts team productivity.
                </p>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-100 py-10 px-6 rounded-lg shadow-lg max-w-5xl w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                    By the Numbers
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <li className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600">💼 $100M+</span>
                        <p className="text-gray-600 text-lg">Annual Revenue</p>
                    </li>
                    <li className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600">🌏 10M+</span>
                        <p className="text-gray-600 text-lg">Active Users</p>
                    </li>
                    <li className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600">🏢 86%</span>
                        <p className="text-gray-600 text-lg">Fortune 500 Companies</p>
                    </li>
                    <li className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-blue-600">📅 500M+</span>
                        <p className="text-gray-600 text-lg">Meetings Scheduled</p>
                    </li>
                </ul>
            </div>
        </div>
    );
}
