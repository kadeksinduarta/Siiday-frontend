import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        if (!router.isReady) return;

        const { token } = router.query;

        if (token) {
            localStorage.setItem('token', token);
            router.push('/dashboard');
        } else {
            // If no token, maybe failed or error
            // router.push('/login?error=auth_failed');
        }
    }, [router.isReady, router.query, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
            <Head>
                <title>Authenticating...</title>
            </Head>
            <div className="animate-pulse flex flex-col items-center">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-zinc-500">Signing you in...</p>
            </div>
        </div>
    );
}
