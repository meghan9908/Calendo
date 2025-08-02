"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { User, Calendar, Clock, Shield, Zap, Users, ArrowRight, Star, CheckCircle } from 'lucide-react';

export default function HeadingComponent() {
    // Mock authentication state - replace with your actual auth logic
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    type UserType = {
        name: string;
        plan: string;
        meetingsThisMonth: number;
        timesSaved: number;
    };
    const [user, setUser] = useState<UserType | null>(null);
    const [animateStats, setAnimateStats] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    useEffect(() => {
    const fetchSession = async () => {
        try {
            const res = await fetch('/api/fetchUser');
            if (res.ok != true) throw new Error("Not authenticated");
            const userData = await res.json();
            console.log("[API_USER] Session data:", userData); 
            setUser(userData);
            setIsLoggedIn(true);
        } catch (err) {
            console.error("User not authenticated", err);
            setIsLoggedIn(false);
            setUser(null);
        }
    };
    fetchSession();
}, []);

    useEffect(() => {
        const timer = setTimeout(() => setAnimateStats(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Testimonials rotation
    const testimonials = [
        { text: "Calendo saved us 20 hours per week", author: "Sarah Chen, CEO at TechCorp" },
        { text: "The best scheduling tool we've ever used", author: "Mike Johnson, VP Sales" },
        { text: "Seamless integration with our workflow", author: "Lisa Wang, Operations Manager" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    type StatCardProps = {
        icon: React.ReactNode;
        value: string | number;
        label: string;
        animate?: boolean;
    };

    const StatCard = ({ icon, value, label, animate = false }: StatCardProps) => (
        <li className="flex flex-col items-center transform hover:scale-105 transition-all duration-300">
            <span className={`text-4xl font-bold text-blue-600 transition-all duration-1000 ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {icon} {value}
            </span>
            <p className="text-gray-600 text-lg">{label}</p>
        </li>
    );

    return (
        <div
            data-testid="heading-component"
            className="flex flex-col items-center text-center mt-16 px-4 space-y-12"
        >
            {/* Dynamic Welcome Section */}
            {isLoggedIn && user && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 max-w-4xl w-full mb-8 animate-fade-in">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <User className="text-blue-600" size={24} />
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Welcome back, {user.name}! 🎉
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <Calendar className="text-blue-600 mx-auto mb-2" size={20} />
                            <p className="font-semibold text-gray-800">{user.meetingsThisMonth} meetings</p>
                            <p className="text-gray-600">this month</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <Clock className="text-green-600 mx-auto mb-2" size={20} />
                            <p className="font-semibold text-gray-800">{user.timesSaved} hours saved</p>
                            <p className="text-gray-600">this week</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <Star className="text-yellow-500 mx-auto mb-2" size={20} />
                            <p className="font-semibold text-gray-800">{user.plan} Plan</p>
                            <p className="text-gray-600">active</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Title Section with Dynamic Content */}
            <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-4">
                    {isLoggedIn ? 'Continue streamlining your schedule' : 'Calendo makes scheduling simple'}
                </h1>
                {!isLoggedIn && (
                    <div className="flex justify-center space-x-4 text-2xl opacity-75 animate-pulse">
                        <Calendar className="text-blue-600" />
                        <Clock className="text-green-600" />
                        <Users className="text-purple-600" />
                    </div>
                )}
            </div>

            {/* Dynamic Description Section */}
            <div className="max-w-2xl">
                <p className="text-gray-600 text-lg md:text-xl mb-6">
                    {isLoggedIn 
                        ? `You're already experiencing the power of seamless scheduling. Explore new features and integrations to maximize your productivity.`
                        : 'Calendo is the go-to platform for professionals, teams, and enterprises looking to simplify their scheduling. With seamless integrations, automated workflows, and world-class security, Calendo powers productivity at scale.'
                    }
                </p>
                
                {/* Dynamic CTAs */}
                <div className="flex justify-center space-x-4 flex-wrap gap-2">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-lg flex items-center group"
                            >
                                Go to Dashboard
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link
                                href="/integrations"
                                className="bg-transparent border border-blue-600 text-blue-600 py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-600 hover:text-white transition duration-300"
                            >
                                Explore Integrations
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/signup"
                                className="bg-blue-600 text-white py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-700 transition duration-300 shadow-lg flex items-center group"
                            >
                                Sign up for free
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                            <Link
                                href="/features"
                                className="bg-transparent border border-blue-600 text-blue-600 py-3 px-8 rounded-full text-lg font-medium hover:bg-blue-600 hover:text-white transition duration-300"
                            >
                                Learn More
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Dynamic Features Section */}
            {!isLoggedIn && (
                <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <Shield className="text-blue-600 mx-auto mb-4" size={40} />
                        <h4 className="text-xl font-semibold text-slate-800 mb-2">Enterprise Security</h4>
                        <p className="text-gray-600">Bank-level encryption and SOC 2 compliance ensure your data is always protected.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <Zap className="text-yellow-500 mx-auto mb-4" size={40} />
                        <h4 className="text-xl font-semibold text-slate-800 mb-2">Lightning Fast</h4>
                        <p className="text-gray-600">Schedule meetings in seconds with our AI-powered smart suggestions and automation.</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                        <Users className="text-purple-600 mx-auto mb-4" size={40} />
                        <h4 className="text-xl font-semibold text-slate-800 mb-2">Team Collaboration</h4>
                        <p className="text-gray-600">Seamlessly coordinate with teams and clients across different time zones and calendars.</p>
                    </div>
                </div>
            )}

            {/* Testimonial Section (Only for non-logged in users) */}
            {!isLoggedIn && (
                <div className="max-w-3xl bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                    <div className="flex justify-center mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-current" size={24} />
                        ))}
                    </div>
                    <blockquote className="text-xl text-gray-700 italic mb-4 transition-all duration-500">
                        "{testimonials[currentTestimonial].text}"
                    </blockquote>
                    <cite className="text-gray-600 font-medium">
                        — {testimonials[currentTestimonial].author}
                    </cite>
                    <div className="flex justify-center mt-4 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                                onClick={() => setCurrentTestimonial(index)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Mission and Vision Section - Conditional Display */}
            {!isLoggedIn && (
                <div className="max-w-4xl space-y-8">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
                            Our Mission
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            To empower individuals and organizations to connect effortlessly, saving time and creating more opportunities for meaningful interactions.
                        </p>
                    </div>
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <h3 className="text-2xl md:text-3xl font-semibold text-slate-800 mb-2">
                            Our Vision
                        </h3>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            To be the world's leading scheduling platform, fostering seamless collaboration and revolutionizing how people manage their time.
                        </p>
                    </div>
                </div>
            )}

            {/* Enhanced Stats Section with Animations */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6 rounded-2xl shadow-xl max-w-5xl w-full">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">
                    {isLoggedIn ? 'You\'re Part of Something Big' : 'By the Numbers'}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon="💼" value="$100M+" label="Annual Revenue" animate={animateStats} />
                    <StatCard icon="🌏" value="10M+" label="Active Users" animate={animateStats} />
                    <StatCard icon="🏢" value="86%" label="Fortune 500 Companies" animate={animateStats} />
                    <StatCard icon="📅" value="500M+" label="Meetings Scheduled" animate={animateStats} />
                </ul>
                
                {isLoggedIn && (
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 flex items-center justify-center">
                            <CheckCircle className="mr-2" size={20} />
                            You're contributing to these amazing numbers every day!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}