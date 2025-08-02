// Enhanced Trustees.tsx
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
            setCurrentSlide((prev) => (prev + 1) % Math.ceil(users.length / 3));
        }, 4000); // Increased to 4 seconds for better viewing
        return () => clearInterval(interval);
    }, [users.length]);

    return (
        <section className="trustees-section text-center fade-in-up">
            <h2 className="float-animation">Our Beloved Users</h2>
            <div className="carousel-container">
                <div
                    className="carousel-track"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {Array.from({ length: Math.ceil(users.length / 3) }).map((_, groupIndex) => {
                        return (
                            <div key={groupIndex} className="carousel-slide">
                                {users.slice(groupIndex * 3, groupIndex * 3 + 3).map((user, index) => (
                                    <div key={index} className="user-card">
                                        <img 
                                            src={user.img} 
                                            alt={user.role} 
                                            className="user-avatar"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x100/667eea/ffffff?text=" + user.role.charAt(0);
                                            }}
                                        />
                                        <p className="user-role">{user.role}</p>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
            
            <div className="carousel-indicators">
                {Array.from({ length: Math.ceil(users.length / 3) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`carousel-dot ${currentSlide === index ? 'active' : 'inactive'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    ></button>
                ))}
            </div>
        </section>
    );
}

