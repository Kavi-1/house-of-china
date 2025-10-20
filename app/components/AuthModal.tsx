"use client";
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { supabase } from '@/lib/supabaseClient';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) setError(error.message);
        else setMessage('Check your email for confirmation link!');
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else {
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} sx={{ '& .MuiDialog-paper': { width: 400, borderRadius: '12px' } }}>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '2rem', letterSpacing: '-1px' }}>
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                </span>
                <IconButton aria-label="close" onClick={onClose} sx={{ color: '#888', ml: 'auto' }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="flex flex-col gap-4 mt-2">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400 font-open-sans"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-red-400 font-open-sans"
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            backgroundColor: '#ef4444',
                            color: '#fff',
                            fontWeight: 'normal',
                            mt: 2,
                            fontFamily: 'Poppins, sans-serif',
                            fontSize: '1.1rem',
                            textTransform: 'none',
                            letterSpacing: '-0.5px',
                            borderRadius: '50px',
                            '&:hover': { backgroundColor: '#dc2626' }
                        }}
                    >
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </Button>
                </form>
                <div className="mt-4 text-center">
                    <Button
                        variant="text"
                        onClick={() => { setIsSignUp(!isSignUp); setError(''); setMessage(''); }}
                        sx={{ color: '#000000ff', fontWeight: 'normal', fontFamily: 'Poppins, sans-serif', fontSize: '1rem', textTransform: 'none', letterSpacing: '-0.5px' }}
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign up!"}
                    </Button>
                </div>
                {error && <div className="text-red-500 mt-4 text-center font-semibold">{error}</div>}
                {message && <div className="text-green-600 mt-4 text-center font-semibold">{message}</div>}
            </DialogContent>
        </Dialog>
    );
}
