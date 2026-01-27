import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import api from '../lib/api';

export default function HabitFormModal({ isOpen, onClose, habitToEdit = null, onHabitSaved }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#4f46e5'); // Default Indigo
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (habitToEdit) {
            setName(habitToEdit.name);
            setColor(habitToEdit.color || '#4f46e5');
        } else {
            setName('');
            setColor('#4f46e5');
        }
    }, [habitToEdit, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (habitToEdit) {
                await api.put(`/habits/${habitToEdit.id}`, { name, color });
            } else {
                await api.post('/habits', { name, color });
            }
            onHabitSaved();
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to save habit');
        } finally {
            setLoading(false);
        }
    };

    const colors = [
        '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
        '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                        {habitToEdit ? 'Edit Habit' : 'New Habit'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Habit Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Read 30 mins"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Color Tag</label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${color === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'}`}
                                    style={{ backgroundColor: c }}
                                >
                                    {color === c && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl font-medium text-zinc-400 hover:bg-zinc-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                        >
                            {loading ? 'Saving...' : (habitToEdit ? 'Save Changes' : 'Create Habit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
