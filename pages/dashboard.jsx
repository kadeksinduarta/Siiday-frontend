import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import api from '../lib/api';
import Link from 'next/link';
import HabitGrid from '../components/HabitGrid';
import ConsistencyTrendChart from '../components/ConsistencyTrendChart';
import WeeklyRecap from '../components/WeeklyRecap';
import StatsOverview from '../components/StatsOverview';
import { LogOut, Plus } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await api.get('/user');
                setUser(response.data);
            } catch (error) {
                console.error('Auth check failed', error);
                localStorage.removeItem('token');
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
            <Head>
                <title>Dashboard - Siiday</title>
            </Head>

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                        <img src="/logo-siiday.png" alt="Siiday Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-zinc-400">Welcome back, {user?.name}!</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="p-2 hover:bg-zinc-900 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                </button>
            </div>

            <div className="flex flex-col gap-8">
                {/* 1. Habit Grid (Top Priority) */}
                <div className="w-full">
                    <HabitGrid />
                </div>

                {/* 2. Key Metrics Row */}
                <div className="w-full">
                    <StatsOverview />
                </div>

                {/* 3. Charts & Shareables Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Habit Velocity Chart (Left 2/3) */}
                    <div className="lg:col-span-2">
                        <ConsistencyTrendChart />
                    </div>

                    {/* Weekly Recap & Pie Chart (Right 1/3) */}
                    <div className="lg:col-span-1">
                        <WeeklyRecap />
                    </div>
                </div>
            </div>
        </div>
    );
}
