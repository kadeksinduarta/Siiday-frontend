import { useState, useEffect } from 'react';
import api from '../lib/api';
import { eachDayOfInterval, format, subYears, getYear, startOfWeek } from 'date-fns';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

export default function ContributionGraph() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await api.get('/stats/contribution');
                const map = {};
                response.contributions.forEach(item => {
                    map[item.date] = item.count;
                });
                setData(map);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-40 flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin" /></div>;

    const today = new Date();
    const oneYearAgo = subYears(today, 1);
    const startDay = startOfWeek(oneYearAgo); // Align to Sunday start

    // Generate days from startDay to today
    const days = eachDayOfInterval({ start: startDay, end: today });

    const getColor = (dateStr) => {
        const count = data[dateStr] || 0;
        if (count === 0) return 'bg-zinc-800/50 hover:bg-zinc-800';
        if (count === 1) return 'bg-emerald-900/80 hover:bg-emerald-800';
        if (count === 2) return 'bg-emerald-700/80 hover:bg-emerald-600';
        if (count >= 3) return 'bg-emerald-500/80 hover:bg-emerald-400';
        return 'bg-zinc-800';
    };

    // Calculate months for labels
    const months = [];
    let currentMonth = -1;
    days.forEach((day, index) => {
        // approximate week by week or change in month
        if (day.getDay() === 0) { // Sunday
            const m = day.getMonth();
            if (m !== currentMonth) {
                months.push({ name: format(day, 'MMM'), index: Math.floor(index / 7) });
                currentMonth = m;
            }
        }
    });

    return (
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 overflow-hidden">
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h2 className="text-xl font-semibold">Consistency Graph</h2>
                    <p className="text-sm text-zinc-400">Total Contributions</p>
                </div>
                <div className="text-3xl font-bold text-zinc-700">
                    {getYear(today)}
                </div>
            </div>

            <div className="overflow-x-auto pb-4 custom-scrollbar">
                <div className="min-w-max">
                    {/* Month Labels */}
                    <div className="flex mb-2 text-xs text-zinc-500 relative h-4">
                        {months.map((m, i) => (
                            <span key={i} style={{ left: `${m.index * 13}px`, position: 'absolute' }}>{m.name}</span>
                        ))}
                    </div>

                    <div className="flex gap-[3px]">
                        {/* Day labels (Mon, Wed, Fri) */}
                        <div className="flex flex-col gap-[3px] mr-2 text-[10px] text-zinc-600 font-mono pt-[13px]">
                            <div className="h-[10px]"></div>
                            <div className="h-[10px]">Mon</div>
                            <div className="h-[10px]"></div>
                            <div className="h-[10px]">Wed</div>
                            <div className="h-[10px]"></div>
                            <div className="h-[10px]">Fri</div>
                            <div className="h-[10px]"></div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-rows-7 grid-flow-col gap-[3px]">
                            {days.map(day => {
                                const dateStr = format(day, 'yyyy-MM-dd');
                                return (
                                    <div
                                        key={dateStr}
                                        className={clsx(
                                            "w-[10px] h-[10px] rounded-[2px] transition-colors cursor-pointer",
                                            getColor(dateStr)
                                        )}
                                        title={`${format(day, 'EEEE, MMM d, yyyy')}: ${data[dateStr] || 0} contributions`}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-xs text-zinc-500">
                <span>Less</span>
                <div className="w-[10px] h-[10px] bg-zinc-800 rounded-[2px]"></div>
                <div className="w-[10px] h-[10px] bg-emerald-900 rounded-[2px]"></div>
                <div className="w-[10px] h-[10px] bg-emerald-700 rounded-[2px]"></div>
                <div className="w-[10px] h-[10px] bg-emerald-500 rounded-[2px]"></div>
                <span>More</span>
            </div>
        </div>
    );
}
