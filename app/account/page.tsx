"use client";
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import OrdersHistoryClient from './OrdersHistoryClient';
import Nav from '../components/Nav';

export default function AccountPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setEmail(user?.email ?? null);
        });
    }, []);


    const handleSignOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            setError(error.message);
        }
        else {
            router.replace('/');
        }
    };

    return (
        <>
            <Nav />
            <main className="font-poppins min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-black">Account Page</h1>
                    <p className="text-lg text-gray-700">Welcome to your account!</p>
                    <p className="mb-8">{email}</p>
                    <button
                        onClick={handleSignOut}
                        className="bg-red-600 hover:bg-red-700 hover:cursor-pointer rounded-full text-white px-4 py-2 rounded font-bold transition"
                    >
                        Sign Out
                    </button>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    <div className="mt-6 text-left">
                        <h2 className="text-xl font-semibold mb-3">Your orders</h2>
                        <OrdersHistoryClient />
                    </div>
                </div>
            </main>
        </>
    );
}