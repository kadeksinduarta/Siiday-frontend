import { useState, useEffect } from 'react';
import api from '../lib/api';
import { Loader2, Award, Zap, CheckCircle2, TrendingUp } from 'lucide-react';
import clsx from 'clsx';

export default function StatsOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/stats/weekly');
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return null; // Or a skeleton
    if (!stats) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            {/* Completions */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-zinc-700 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Total Completions</span>
                <span className="text-3xl font-black text-white">{stats.weekly_completions}</span>
            </div>

            {/* Consistent Days */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <TrendingUp className="w-12 h-12 text-indigo-500" />
                </div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Consistency</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-indigo-400">{stats.consistent_days}</span>
                    <span className="text-sm font-medium text-zinc-600">/ 7</span>
                </div>
            </div>

            {/* Streak */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-orange-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Zap className="w-12 h-12 text-orange-500" />
                </div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Current Streak</span>
                <div className="flex items-center gap-1 text-3xl font-black text-orange-400">
                    <Zap className="w-6 h-6 fill-current" />
                    {stats.current_streak}
                </div>
            </div>

            {/* Badges */}
            <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Award className="w-12 h-12 text-yellow-500" />
                </div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Badges Earned</span>
                <span className="text-3xl font-black text-yellow-400 flex items-center gap-2">
                    <Award className="w-6 h-6" /> 0
                </span>
            </div>
        </div>
    );
}
