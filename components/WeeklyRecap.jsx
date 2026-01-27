import { useState, useEffect, useRef } from 'react';
import api from '../lib/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from 'recharts';
import { Loader2, Share2, Award, Zap, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';

export default function WeeklyRecap() {
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [loading, setLoading] = useState(true);
    const cardRef = useRef(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [statsRes, trendRes] = await Promise.all([
                    api.get('/stats/weekly'),
                    api.get('/stats/trend')
                ]);
                setStats(statsRes.data);
                setTrendData(trendRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const downloadImage = async () => {
        if (cardRef.current) {
            try {
                // Force specific size for export to prevent cutting off
                const dataUrl = await htmlToImage.toPng(cardRef.current, {
                    pixelRatio: 3, // Higher quality
                    backgroundColor: '#09090b', // Ensure background is dark
                    width: 300,
                    height: 534, // 9/16 ratio approximate
                    style: {
                        transform: 'scale(1)', // Reset any potential scaling
                    }
                });
                saveAs(dataUrl, 'siiday-weekly-recap.png');
            } catch (err) {
                console.error("Failed to generate image", err);
            }
        }
    };

    // Calculate chart width based on card (300px - padding)
    const CHART_WIDTH = 260;
    const CHART_HEIGHT = 80;

    if (loading) return <div className="h-64 flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin" /></div>;

    if (!stats) return null;

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl w-full">
                <h3 className="text-sm font-semibold mb-4 text-zinc-400 uppercase tracking-widest text-center">Your Mix</h3>
                <div className="h-48 w-full relative">
                    {stats.distribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.distribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={70}
                                    innerRadius={35}
                                    fill="#8884d8"
                                    dataKey="value"
                                    paddingAngle={5}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {stats.distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color || '#4F46E5'} stroke="rgba(0,0,0,0.5)" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-zinc-500 text-xs">
                            <p>No activity yet</p>
                        </div>
                    )}
                    {/* Center Total Count if Pie present */}
                    {stats.distribution.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-white">{stats.weekly_completions}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Shareable Card (Instagram Story Style) */}
            <div className="flex flex-col gap-4 items-center">
                <div className="flex justify-between items-center w-full px-2">
                    <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">Share Progress</h3>
                    <button
                        onClick={downloadImage}
                        className="bg-white text-black hover:bg-zinc-200 text-xs px-3 py-1.5 rounded-full font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-white/10 active:scale-95"
                    >
                        <Share2 className="w-3 h-3" /> Save Story
                    </button>
                </div>

                <div className="flex justify-center bg-zinc-950/50 p-4 rounded-3xl border border-zinc-900 overflow-hidden w-full max-w-[360px]">
                    <div
                        ref={cardRef}
                        className="w-[300px] h-[534px] bg-zinc-950 relative overflow-hidden flex flex-col shadow-2xl text-white font-sans selection:bg-indigo-500/30 shrink-0 mx-auto"
                        style={{ width: '300px', height: '534px' }} // Enforce inline style for capture
                    >
                        {/* Modern Abstract Bloom Background */}
                        <div className="absolute top-[-10%] right-[-30%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] opacity-60"></div>
                        <div className="absolute bottom-[-10%] left-[-20%] w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[80px] opacity-40"></div>

                        {/* Subtle Grid Pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]"></div>

                        {/* Content Container */}
                        <div className="relative z-10 flex flex-col h-full p-6">

                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase mb-1">Weekly Report</div>
                                    <div className="text-[10px] font-medium text-zinc-300 bg-zinc-900/50 px-2 py-1 rounded border border-zinc-800 inline-block">
                                        {stats.start_date} — {stats.end_date}
                                    </div>
                                </div>
                                <div className="w-8 h-8 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                                    <img src="/logo-siiday.png" alt="SD" className="w-5 h-5 object-contain" />
                                </div>
                            </div>

                            {/* Main Title */}
                            <div className="mb-6">
                                <h1 className="text-4xl font-black text-white leading-[0.9] tracking-tighter">
                                    KEEP<br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">PUSHING.</span>
                                </h1>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center text-center">
                                    <div className="mb-1.5 p-1.5 bg-indigo-500/10 rounded-full">
                                        <Award className="w-3 h-3 text-indigo-400" />
                                    </div>
                                    <div className="text-lg font-bold text-white leading-none mb-0.5">{stats.consistent_days}</div>
                                    <div className="text-[7px] text-zinc-500 font-bold uppercase tracking-wider">Days</div>
                                </div>

                                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center text-center">
                                    <div className="mb-1.5 p-1.5 bg-orange-500/10 rounded-full">
                                        <Zap className="w-3 h-3 text-orange-400" />
                                    </div>
                                    <div className="text-lg font-bold text-white leading-none mb-0.5">{stats.current_streak}</div>
                                    <div className="text-[7px] text-zinc-500 font-bold uppercase tracking-wider">Streak</div>
                                </div>

                                <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-2 rounded-xl flex flex-col items-center justify-center text-center">
                                    <div className="mb-1.5 p-1.5 bg-emerald-500/10 rounded-full">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <div className="text-lg font-bold text-white leading-none mb-0.5">{stats.weekly_completions}</div>
                                    <div className="text-[7px] text-zinc-500 font-bold uppercase tracking-wider">Done</div>
                                </div>
                            </div>

                            {/* Weekly Graph Section - Fixed Size for Export Stability */}
                            <div className="flex-1 bg-zinc-900/30 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex flex-col relative overflow-hidden">
                                <div className="flex items-center justify-between mb-2 z-10 relative">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[10px] font-bold text-white tracking-wide">Weekly Momentum</span>
                                    </div>
                                </div>

                                {/* Graph Container */}
                                <div className="absolute inset-0 flex items-end justify-center pb-2">
                                    {/* Using fixed width/height LineChart to ensure it renders for image capture without ResizeObserver issues */}
                                    <LineChart width={CHART_WIDTH} height={CHART_HEIGHT} data={trendData.slice(-7)}>
                                        <defs>
                                            <linearGradient id="chartGradientCard" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Line
                                            type="monotone"
                                            dataKey="percentage"
                                            stroke="#818cf8"
                                            strokeWidth={3}
                                            dot={{ r: 3, fill: "#fff", strokeWidth: 0 }}
                                            activeDot={false}
                                            isAnimationActive={false}
                                        />
                                        {/* Hidden axes to maintain scale but keep visuals clean */}
                                        <XAxis hide dataKey="date" />
                                        <YAxis hide domain={[0, 100]} />
                                    </LineChart>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="mt-4 flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] text-zinc-500 font-medium tracking-wide">Generated by</p>
                                    <p className="text-xs font-bold text-white tracking-tight">SIIDAY.</p>
                                </div>
                                <div className="px-2 py-0.5 bg-white/10 rounded-full border border-white/10 backdrop-blur-sm">
                                    <p className="text-[8px] font-bold text-white/80">#HabitBuilder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
