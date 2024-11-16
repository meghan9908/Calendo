'use client'
import { useState, useEffect } from 'react';

export default function Trustees() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const users = [
        { img: "https://img.freepik.com/premium-photo/young-girl-face-with-skin-detail_1130181-32744.jpg?w=360", role: "Artist" },
        { img: "https://img.freepik.com/free-photo/headshot-attractive-man-smiling-pleased-looking-intrigued-standing-blue-background_1258-65468.jpg?semt=ais_hybrid", role: "Designer" },
        { img: "https://img.freepik.com/free-photo/young-beautiful-woman-looking-camera-trendy-girl-casual-summer-white-t-shirt-jeans-shorts-positive-female-shows-facial-emotions-funny-model-isolated-yellow_158538-15796.jpg?semt=ais_hybrid", role: "Student" },
        { img: "https://img.freepik.com/free-photo/latin-man-smiling-mockup-psd-cheerful-expression-closeup-portrai_53876-145665.jpg?semt=ais_hybrid", role: "Creator" },
        { img: "https://img.freepik.com/free-photo/headshot-attractive-red-haired-european-woman-with-freckled-skin-looks-seriously-camera-has-minimal-make-up-wears-red-sweater-isolated-white-natural-beauty-concept_176532-8382.jpg?semt=ais_hybrid", role: "Photographer" },
        { img: "https://img.freepik.com/premium-photo/young-indian-man-standing-white-background_601128-11778.jpg?w=740", role: "Teacher" },
        { img: "https://img.freepik.com/free-photo/image-young-hopeful-woman-smiling-happy-looking-aside-empty-space-white_176420-41242.jpg?t=st=1730373623~exp=1730377223~hmac=9807c1ec7e4c6f052068c3b15a5e9eb5be794b7f9941839991fc8de55334224f&w=740", role: "Freelancer" },
        { img: "https://img.freepik.com/premium-photo/close-up-portrait-his-he-nice-attractive-smart-clever-cheerful-cheery-doc-professor-emergency-center-owner-director-ceo-boss-chief-isolated-light-white-gray-pastel-color_274222-21030.jpg?w=740", role: "Doctor" },
        { img: "https://img.freepik.com/premium-photo/architecture-serious-portrait-man-construction-site-engineering-design-building-labor-real-estate-property-with-face-contractor-renovation-builder-maintenance_590464-205042.jpg?w=740", role: "Architect" }

    
    
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(users.length / 3)); // Move to next slide every 3 seconds
        }, 3000);
        return () => clearInterval(interval);
    }, [users.length]);

    return (
        <section className="text-center mt-24">
            <h2 className="text-2xl text-gray-600">Our Beloved Users</h2>
            <div className="overflow-hidden relative mt-5">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {/* Group items in sets of 3 */}
                    {Array.from({ length: Math.ceil(users.length / 3) }).map((_, groupIndex) => {
                            
                           return (<div key={groupIndex} className="flex min-w-full justify-around">
                
                            {users.slice(groupIndex * 3, groupIndex * 3 + 3).map((user, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <img src={user.img} alt={user.role} className="w-24 h-24 rounded-full object-cover" />
                                    <p className="caption mt-2 text-gray-600">{user.role}</p>
                                </div>
                            ))}
                        </div>);}
                    )}
                </div>
            </div>
            {/* Carousel navigation */}
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: Math.ceil(users.length / 3) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-gray-800' : 'bg-gray-400'}`}
                    ></button>
                ))}
            </div>
        </section>
    );
}
