'use client';

export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white mt-5 py-10 w-full">
            <div className="container mx-auto px-6 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Company Info Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Calendo</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Calendo is a cutting-edge scheduling platform designed to simplify planning and boost productivity for individuals and enterprises worldwide.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/about" className="text-gray-400 hover:text-white transition">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="/features" className="text-gray-400 hover:text-white transition">
                                    Features
                                </a>
                            </li>
                            <li>
                                <a href="/pricing" className="text-gray-400 hover:text-white transition">
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-400 hover:text-white transition">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <p className="text-sm text-gray-400">
                            Email: <a href="mailto:support@calendo.com" className="hover:underline">support@calendo.com</a>
                        </p>
                        <p className="text-sm text-gray-400">
                            Phone: <a href="tel:+1234567890" className="hover:underline">+1 234 567 890</a>
                        </p>
                        <div className="flex justify-center md:justify-start mt-4 gap-4">
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                                <img src="/icons/twitter.svg" alt="Twitter" className="h-6 w-6 hover:opacity-75" />
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <img src="/icons/facebook.svg" alt="Facebook" className="h-6 w-6 hover:opacity-75" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <img src="/icons/linkedin.svg" alt="LinkedIn" className="h-6 w-6 hover:opacity-75" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-700 mt-8 pt-6 text-center">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Calendo. All rights reserved.
                    </p>
                    <div className="flex justify-center space-x-4 mt-4">
                        <a href="/privacy" className="text-gray-400 hover:text-white transition">
                            Privacy Policy
                        </a>
                        <a href="/terms" className="text-gray-400 hover:text-white transition">
                            Terms of Service
                        </a>
                        <a href="/sitemap" className="text-gray-400 hover:text-white transition">
                            Sitemap
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
