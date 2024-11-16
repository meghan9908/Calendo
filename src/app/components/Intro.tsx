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
            router.replace('/');  // Replaces current URL without adding to history
            router.refresh();  // Refreshes the page content
        }
        setUnderline(true);
    }, [searchParams, router]);
    
    return (
        <section className="text-center mt-12">
            <h1 className="text-blue-600 text-4xl font-bold mb-3">
                Plan Tomorrow &nbsp;
                <span className={`text-slate-800 cool-underline ${underline ? 'show-underline' : ''}`}>
                    Day Ahead
                </span>
            </h1>
            <p className="text-gray-600 text-2xl">
                Calendo is your scheduling automation platform for eliminating the back-and-forth emails to find the perfect time — and so much more.
            </p>
            <div className='flex gap-10 items-center justify-center mt-5 text-2xl'>
                <Link href='/get-started' className='bg-black py-2 px-4 rounded-full text-white'>Get Started</Link>
                <Link href='/watch-video' className='border rounded-full flex gap-2 items-center text-slate-800 py-2 px-4'>
                    <PlayIcon size={18} />
                    Watch video
                </Link>
            </div>
        </section>
    );
}
