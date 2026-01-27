import { useState, useEffect } from 'react';
import api from '../lib/api';
import { eachDayOfInterval, format, startOfWeek, endOfWeek, isToday } from 'date-fns';
import clsx from 'clsx';
import { Loader2, ChevronLeft, ChevronRight, Check, Plus, MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import HabitFormModal from './HabitFormModal';

export default function HabitGrid() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Switch to Weekly View to avoid scrolling
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    const fetchHabits = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/habits', {
                params: {
                    start_date: format(weekStart, 'yyyy-MM-dd'),
                    end_date: format(weekEnd, 'yyyy-MM-dd')
                }
            });
            setHabits(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, [currentDate]);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = () => setActiveMenuId(null);
        if (activeMenuId) document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [activeMenuId]);

    const toggleHabit = async (habitId, day) => {
        if (!isToday(day)) return;

        const dateStr = format(day, 'yyyy-MM-dd');

        // Optimistic update
        setHabits(prev => prev.map(h => {
            if (h.id === habitId) {
                const exists = h.logs.some(l => l.date === dateStr);
                let newLogs;
                if (exists) {
                    newLogs = h.logs.filter(l => l.date !== dateStr);
                } else {
                    newLogs = [...h.logs, { date: dateStr, status: 'completed' }];
                }
                return { ...h, logs: newLogs };
            }
            return h;
        }));

        try {
            await api.post(`/habits/${habitId}/toggle`, { date: dateStr });
        } catch (err) {
            console.error(err);
            fetchHabits();
        }
    };

    const handleDelete = async (habitId) => {
        if (!confirm('Are you sure you want to delete this habit?')) return;

        try {
            await api.delete(`/habits/${habitId}`);
            fetchHabits();
        } catch (err) {
            console.error(err);
            alert('Failed to delete habit');
        }
    };

    const changeWeek = (offset) => {
        const newDate = new Date(new Date(currentDate).setDate(currentDate.getDate() + (offset * 7)));
        setCurrentDate(newDate);
    };

    const calculateDailyCompletion = (day) => {
        if (habits.length === 0) return 0;
        const dateStr = format(day, 'yyyy-MM-dd');
        const completedCount = habits.filter(h => h.logs.some(l => l.date === dateStr)).length;
        return Math.round((completedCount / habits.length) * 100);
    };

    if (loading && habits.length === 0) return <div className="h-64 flex items-center justify-center"><Loader2 className="animate-spin text-zinc-500" /></div>;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col h-full relative">
            <HabitFormModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingHabit(null); }}
                habitToEdit={editingHabit}
                onHabitSaved={fetchHabits}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight text-white mb-1">Weekly Focus</h2>
                    <p className="text-zinc-400 text-sm">Focus on today, track your week.</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-zinc-950/80 rounded-xl p-1.5 border border-zinc-800">
                        <button onClick={() => changeWeek(-1)} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors group">
                            <ChevronLeft className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                        </button>
                        <span className="text-sm font-medium px-2 text-center text-zinc-200 min-w-[140px]">
                            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
                        </span>
                        <button onClick={() => changeWeek(1)} className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors group">
                            <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-white" />
                        </button>
                    </div>

                    <button
                        onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2 transition-colors shadow-lg shadow-indigo-600/20 active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Habit
                    </button>
                </div>
            </div>

            <div className="w-full overflow-x-auto pb-4">
                <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                        <tr>
                            <th className="w-1/4 text-left py-4 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Habit</th>
                            {days.map(day => {
                                const active = isToday(day);
                                return (
                                    <th key={day.toString()} className="relative py-4 px-2">
                                        <div className={clsx(
                                            "flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-300",
                                            active ? "bg-indigo-600/10 -translate-y-1" : "opacity-70"
                                        )}>
                                            <span className={clsx("text-[10px] uppercase mb-1 font-bold", active ? "text-indigo-400" : "text-zinc-500")}>
                                                {format(day, 'EEE')}
                                            </span>
                                            <span className={clsx(
                                                "text-lg font-bold",
                                                active ? "text-indigo-400" : "text-zinc-400"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                        {habits.map(habit => (
                            <tr key={habit.id} className="group hover:bg-zinc-800/20 transition-colors">
                                <td className="py-4 px-4 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-8 rounded-full transition-all group-hover:h-10 shadow-[0_0_10px_opacity-0] group-hover:shadow-[0_0_8px_rgba(255,255,255,0.3)]"
                                                style={{ backgroundColor: habit.color || '#4F46E5', width: '4px' }}>
                                            </div>
                                            <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">{habit.name}</span>
                                        </div>

                                        {/* Actions Menu */}
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenuId(activeMenuId === habit.id ? null : habit.id);
                                                }}
                                                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-700/50 rounded-lg opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                            >
                                                <MoreVertical className="w-4 h-4" />
                                            </button>

                                            {activeMenuId === habit.id && (
                                                <div className="absolute left-0 top-full mt-1 w-32 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingHabit(habit);
                                                            setIsModalOpen(true);
                                                            setActiveMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center gap-2"
                                                    >
                                                        <Pencil className="w-3.5 h-3.5" /> Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(habit.id);
                                                            setActiveMenuId(null);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                {days.map(day => {
                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const isCompleted = habit.logs.some(l => l.date === dateStr);
                                    const active = isToday(day);
                                    const canCheck = active;

                                    return (
                                        <td key={dateStr} className="p-2 text-center">
                                            <button
                                                onClick={() => toggleHabit(habit.id, day)}
                                                disabled={!canCheck}
                                                className={clsx(
                                                    "w-10 h-10 mx-auto rounded-xl flex items-center justify-center transition-all duration-300",
                                                    isCompleted
                                                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-100"
                                                        : "bg-zinc-800/40 text-transparent scale-90",

                                                    !isCompleted && canCheck && "hover:bg-zinc-700 hover:scale-95 cursor-pointer border-2 border-dashed border-zinc-700 hover:border-zinc-500",
                                                    !canCheck && !isCompleted && "opacity-30 cursor-not-allowed border-2 border-transparent",
                                                    !canCheck && isCompleted && "opacity-60 cursor-not-allowed"
                                                )}
                                            >
                                                {isCompleted ? <Check className="w-5 h-5 stroke-[3px]" /> : (active ? <div className="w-2 h-2 rounded-full bg-zinc-700" /> : null)}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td className="pt-6 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Daily Score</td>
                            {days.map((day, i) => {
                                const pct = calculateDailyCompletion(day);
                                return (
                                    <td key={i} className="pt-6 text-center">
                                        <div className={clsx(
                                            "inline-flex items-center justify-center px-2 py-1 rounded-md text-xs font-bold font-mono border",
                                            pct >= 80 ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" :
                                                pct >= 40 ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                                                    "border-zinc-700 bg-zinc-800 text-zinc-500"
                                        )}>
                                            {pct}%
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    </tfoot>
                </table>

                {habits.length === 0 && (
                    <div className="text-center py-16 text-zinc-500 border-t border-zinc-800 mt-4 border-dashed">
                        <p className="mb-4">No habits active this week.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            Create your first habit
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
