'use client';
import { PlayIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Intro() {
    const [underline, setUnderline] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
        
    useEffect(() => {
        if (searchParams.get('logout') === '1') {
            router.replace('/');
            router.refresh();
        }
        
        // Delay the underline animation for better effect
        const timer = setTimeout(() => {
            setUnderline(true);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [searchParams, router]);
        
    return (
        <section className="intro-section text-center fade-in-up">
            <h1>
                Plan Tomorrow &nbsp;
                <span className={`cool-underline ${underline ? 'show-underline' : ''}`}>
                    Day Ahead
                </span>
            </h1>
            <p>
                Calendo is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and so much more.
            </p>
            <div className='intro-buttons'>
                <Link href='/get-started' className='btn-primary'>
                    Get Started
                </Link>
                <Link href='/watch-video' className='btn-secondary'>
                    <PlayIcon size={18} />
                    Watch video
                </Link>
            </div>
        </section>
    );
}