import Head from 'next/head';
import { LayoutGrid, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';

export default function Login() {
    const router = useRouter();
    const [mode, setMode] = useState('login'); // 'login' or 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const handleGoogleLogin = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/redirect`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                const { data } = await api.post('/login', { email, password });
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            } else {
                if (password !== passwordConfirmation) {
                    setError('Passwords do not match');
                    setLoading(false);
                    return;
                }
                const { data } = await api.post('/register', {
                    name,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                });
                localStorage.setItem('token', data.token);
                router.push('/dashboard');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-4">
            <Head>
                <title>{mode === 'login' ? 'Login' : 'Register'} - Siiday</title>
            </Head>

            <div className="max-w-md w-full p-8 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                        <img src="/logo-siiday.png" alt="Siiday Logo" className="w-10 h-10 object-contain" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-2 text-center">
                    {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-zinc-400 mb-8 text-center">
                    {mode === 'login' ? 'Enter your credentials to access your account' : 'Start your habit tracking journey today'}
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                            required
                        />
                    </div>

                    {mode === 'register' && (
                        <div>
                            <label className="block text-sm font-medium text-zinc-400 mb-1">Confirm Password</label>
                            <input
                                type="password"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                required
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-800"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-zinc-900 text-zinc-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-zinc-950 font-medium rounded-xl hover:bg-zinc-200 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Google
                </button>

                <p className="mt-8 text-center text-sm text-zinc-400">
                    {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => {
                            setMode(mode === 'login' ? 'register' : 'login');
                            setError('');
                        }}
                        className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                        {mode === 'login' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
    );
}
