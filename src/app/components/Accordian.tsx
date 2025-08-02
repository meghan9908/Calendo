
// Enhanced Accordion.tsx
"use client";
import { useState } from 'react';

const AccordionItem = ({ 
    title, 
    content, 
    imageSrc, 
    iconFill, 
    index 
}: { 
    title: string, 
    content: string, 
    imageSrc: string, 
    iconFill: string, 
    index: number 
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div 
            className={`accordion-item ${isOpen ? 'open' : ''}`} 
            style={{ '--progress-bar': isOpen ? '100%' : '0%' } as React.CSSProperties}
        >
            <button 
                onClick={toggleAccordion} 
                className="accordion-button"
                aria-expanded={isOpen}
                aria-controls={`accordion-content-${index}`}
            >
                <div className="accordion-icon" style={{ backgroundColor: `${iconFill}20` }}>
                    <svg width="24" height="24" style={{ fill: iconFill }}>
                        <use href={`/media/icons/brand-shapes.svg#filled-3d-0${index}`}></use>
                    </svg>
                </div>
                <h3>{title}</h3>
            </button>
            <div 
                id={`accordion-content-${index}`}
                className={`accordion-content ${isOpen ? 'visible' : ''}`}
            >
                <p>{content}</p>
                <div className="accordion-image">
                    <img 
                        src={imageSrc} 
                        alt={title}
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x400/667eea/ffffff?text=Image+Not+Found";
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

const Accordion = () => {
    const accordionData = [
    {
      title: 'Connect your calendars',
      content: 'Calendly connects up to six calendars to automate scheduling with real-time availability.',
      imageSrc: 'https://images.ctfassets.net/k0lk9kiuza3o/4NxN65mDr8P3MkFqaaKE2W/39053e1843ca1e63b6ecf86b6bd50a02/connect-your-calendars.png?w=1300&q=85&fm=webp',
      iconFill: '#006BFF',
      index: 1
    },
    {
      title: 'Add your availability',
      content: 'Take control of your calendar with detailed availability settings, scheduling rules, buffers, and more.',
      imageSrc: 'https://images.ctfassets.net/k0lk9kiuza3o/3uhXLeNh7p33JzpuSffAEF/009eef428d442a902b9f22453bcc1e04/add-your-availability.png?w=1300&q=85&fm=webp',
      iconFill: '#8247F5',
      index: 2
    },
    {
      title: 'Connect conferencing tools',
      content: 'Sync your video conferencing tools and set preferences for in-person meetings or calls.',
      imageSrc: 'https://images.ctfassets.net/k0lk9kiuza3o/3puzS47NYyiqZoWFiycrH9/adec1f0b941e4f40e1b0503b96ed71d5/connect-conferencing-tools.png?w=1300&q=85&fm=webp',
      iconFill: '#E55CFF',
      index: 3
    },
    {
      title: 'Customize your event types',
      content: 'Choose from pre-built templates or quickly create custom event types for any meeting you need to schedule.',
      imageSrc: 'https://images.ctfassets.net/k0lk9kiuza3o/1tfXAIpnhfvJXzG7R9nqxc/0eb133b6908036371c44095751e03f88/customize-event-types.png?w=1300&q=85&fm=webp',
      iconFill: '#FFA600',
      index: 4
    },
    {
      title: 'Share your scheduling link',
      content: 'Easily book meetings by embedding scheduling links on your website, landing pages, or emails.',
      imageSrc: 'https://images.ctfassets.net/k0lk9kiuza3o/4NxN65mDr8P3MkFqaaKE2W/39053e1843ca1e63b6ecf86b6bd50a02/connect-your-calendars.png?w=1300&q=85&fm=webp',
      iconFill: '#14AA51',
      index: 5
    }
  ];

    return (
        <div className="accordion-container fade-in-up">
            {accordionData.map((item, index) => (
                <AccordionItem
                    key={index}
                    title={item.title}
                    content={item.content}
                    imageSrc={item.imageSrc}
                    iconFill={item.iconFill}
                    index={item.index}
                />
            ))}
        </div>
    );
};

export default Accordion;
