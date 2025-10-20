"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AuthModal from './AuthModal';
import MenuIcon from '@mui/icons-material/Menu';

export default function Nav() {
    const linkStyle = "text-xl font-open-sans";
    const [user, setUser] = useState<User | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
        };
        getSession();
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 w-full flex text-white justify-between items-center text-2xl h-16 px-8 bg-red-500 shadow-md">
            <div className='w-1/3 flex justify-start'>
                <Link href="/" className="font-chinese font-bold tracking-wider text-lg sm:text-2xl md:text-3xl whitespace-nowrap">
                    House of China
                </Link>
            </div>
            <div className='w-1/3 hidden sm:flex justify-center'>
                <ul className="flex flex-row items-center gap-6 text-lg">
                    <li>
                        <Link href="/" className={linkStyle}>Home</Link>
                    </li>
                    <li>
                        <Link href="/menu" className={linkStyle}>Menu</Link>
                    </li>
                    <li>
                        <Link href="/#about" className={linkStyle}>About</Link>
                    </li>
                    <li>
                        <Link href="/#contact" className={linkStyle}>Contact</Link>
                    </li>
                </ul>
            </div>
            <div className="w-1/3 flex justify-end items-center gap-4">
                {/* hamburger menu */}
                <button
                    className="sm:hidden p-2 mx-0 rounded-md hover:bg-red-600 hover:cursor-pointer transition flex justify-center items-center"
                    onClick={() => setMenuOpen((s) => !s)}
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                >
                    <MenuIcon />
                </button>

                {user ? (
                    <Link href="/account" className="hover:cursor-pointer">
                        <AccountCircleIcon sx={{ color: '#ffffffff', width: 40, height: 32 }} />
                    </Link>
                ) : (
                    <button onClick={() => setAuthModalOpen(true)}
                        className="font-poppins bg-white text-lg text-red-500 px-4 py-2 rounded shadow hover:bg-red-100 hover:cursor-pointer transition rounded-full whitespace-nowrap">
                        Sign in
                    </button>
                )}
            </div>
            <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
            <MobileDropdown open={menuOpen} onClose={() => setMenuOpen(false)} onSignIn={() => { setAuthModalOpen(true); setMenuOpen(false); }} />
        </nav>
    );
}

// hamburger menu options
function MobileDropdown({ open, onClose, onSignIn }: { open: boolean; onClose: () => void; onSignIn: () => void }) {
    if (!open) return null;
    const linkStyle = "block px-4 py-3 text-base font-medium text-white hover:bg-red-600 rounded";

    return (
        <div id="mobile-menu" className="font-poppins sm:hidden fixed top-16 left-0 right-0 bg-red-500/95 z-40">
            <div className="px-4 pt-2 pb-4">
                <Link href="/menu" className={`${linkStyle} border-b border-white/40`} onClick={onClose}>Menu</Link>
                <Link href="/#about" className={`${linkStyle} border-b border-white/40`} onClick={onClose}>About</Link>
                <Link href="/#contact" className={linkStyle} onClick={onClose}>Contact</Link>
            </div>
        </div>
    );
}
