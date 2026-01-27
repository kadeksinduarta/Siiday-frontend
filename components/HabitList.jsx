import { useState, useEffect } from 'react';
import api from '../lib/api';
import clsx from 'clsx';
import { Plus, Check, Loader2, Trash2 } from 'lucide-react';

export default function HabitList() {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newHabitName, setNewHabitName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const fetchHabits = async () => {
        try {
            const { data } = await api.get('/habits');
            setHabits(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const toggleHabit = async (id) => {
        // Optimistic Update
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                const isCompleted = h.logs.length > 0;
                return { ...h, logs: isCompleted ? [] : [{ status: 'completed' }] };
            }
            return h;
        }));

        try {
            await api.post(`/habits/${id}/toggle`);
            // Optionally refetch to ensure sync
            // fetchHabits(); 
        } catch (err) {
            console.error(err);
            // Revert if failed
            fetchHabits();
        }
    };

    const addHabit = async (e) => {
        e.preventDefault();
        if (!newHabitName.trim()) return;

        try {
            const { data } = await api.post('/habits', { name: newHabitName });
            setHabits([...habits, { ...data, logs: [] }]); // Add new habit with empty logs
            setNewHabitName('');
            setIsAdding(false);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteHabit = async (id) => {
        if (!confirm('Are you sure you want to delete this habit?')) return;
        try {
            await api.delete(`/habits/${id}`);
            setHabits(habits.filter(h => h.id !== id));
        } catch (err) {
            console.error(err);
        }
    }

    if (loading) return <div className="text-zinc-500 flex gap-2"><Loader2 className="animate-spin" /> Loading habits...</div>;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Today's Habits</h2>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5 text-indigo-400" />
                </button>
            </div>

            {isAdding && (
                <form onSubmit={addHabit} className="mb-4 flex gap-2">
                    <input
                        type="text"
                        value={newHabitName}
                        onChange={(e) => setNewHabitName(e.target.value)}
                        placeholder="Enter habit name..."
                        className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
                        autoFocus
                    />
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-lg font-medium">Add</button>
                </form>
            )}

            <div className="space-y-3">
                {habits.length === 0 && !isAdding && (
                    <p className="text-zinc-500 text-center py-4">No habits yet. Start by adding one!</p>
                )}

                {habits.map(habit => {
                    const isCompleted = habit.logs && habit.logs.length > 0;

                    return (
                        <div
                            key={habit.id}
                            className={clsx(
                                "group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none",
                                isCompleted
                                    ? "bg-indigo-500/10 border-indigo-500/20"
                                    : "bg-zinc-950 border-zinc-800 hover:border-zinc-700"
                            )}
                        >
                            <div className="flex items-center gap-4 flex-1" onClick={() => toggleHabit(habit.id)}>
                                <div className={clsx(
                                    "w-6 h-6 rounded-md border flex items-center justify-center transition-colors",
                                    isCompleted ? "bg-indigo-500 border-indigo-500" : "border-zinc-600 group-hover:border-zinc-500"
                                )}>
                                    {isCompleted && <Check className="w-4 h-4 text-white" />}
                                </div>
                                <span className={clsx("font-medium", isCompleted && "text-zinc-400 line-through")}>
                                    {habit.name}
                                </span>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-zinc-500 hover:text-red-400 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
