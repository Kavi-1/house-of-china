// "use client";
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { supabase } from '@/lib/supabaseClient';
// import Nav from '../components/Nav';

// export default function AuthPage() {
//     const router = useRouter();
//     const [isSignUp, setIsSignUp] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');
//     useEffect(() => {
//         const checkSession = async () => {
//             const { data: { session } } = await supabase.auth.getSession();
//             if (session) {
//                 router.replace('/');
//             }
//         };
//         checkSession();
//         const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
//             if (session) {
//                 router.replace('/');
//             }
//         });
//         return () => {
//             listener.subscription.unsubscribe();
//         };
//     }, [router]);

//     const handleSignUp = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');
//         setMessage('');
//         const { error } = await supabase.auth.signUp({ email, password });
//         if (error) setError(error.message);
//         else setMessage('Check your email for confirmation link!');
//     };

//     const handleSignIn = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');
//         setMessage('');
//         const { error } = await supabase.auth.signInWithPassword({ email, password });
//         if (error) setError(error.message);
//         else setMessage('Signed in!');
//     };

//     return (
//         <>
//             {/* <Nav /> */}
//             <main className="min-h-screen flex items-center justify-center bg-gray-50">
//                 <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 border border-gray-200">
//                     <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
//                     <form className="flex flex-col gap-4" onSubmit={isSignUp ? handleSignUp : handleSignIn}>
//                         <input
//                             type="email"
//                             placeholder="Email"
//                             value={email}
//                             onChange={e => setEmail(e.target.value)}
//                             className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-open-sans"
//                             required
//                         />
//                         <input
//                             type="password"
//                             placeholder="Password"
//                             value={password}
//                             onChange={e => setPassword(e.target.value)}
//                             className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-open-sans"
//                             required
//                         />
//                         <button
//                             type="submit"
//                             className={isSignUp
//                                 ? "bg-green-600 hover:bg-green-700 text-white px-4 py-2 hover:cursor-pointer rounded w-full font-bold transition"
//                                 : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 hover:cursor-pointer rounded w-full font-bold transition"
//                             }
//                         >
//                             {isSignUp ? 'Sign Up' : 'Sign In'}
//                         </button>
//                     </form>
//                     <div className="mt-6 text-center">
//                         <button
//                             type="button"
//                             className="text-blue-600 no-underline hover:text-blue-800 font-semibold hover:cursor-pointer font-open-sans"
//                             onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
//                         >
//                             {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}

//                         </button>
//                     </div>
//                     {error && <div className="text-red-500 mt-4 text-center font-semibold">{error}</div>}
//                     {message && <div className="text-green-600 mt-4 text-center font-semibold">{message}</div>}
//                 </div>
//             </main>
//         </>
//     );
// }
