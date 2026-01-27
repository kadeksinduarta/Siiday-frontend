import { useState, useEffect } from 'react';
import api from '../lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Dot } from 'recharts';
import { Loader2, TrendingUp } from 'lucide-react';

export default function ConsistencyTrendChart() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: response } = await api.get('/stats/trend');
                // Ensure we have last 14-30 days
                // User image shows 1-16 (X axis), so let's show roughly 14 points for clarity or full 30
                setData(response);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="h-64 flex items-center justify-center text-zinc-500"><Loader2 className="animate-spin" /></div>;

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white text-zinc-900 border border-zinc-200 p-2 rounded shadow-xl text-xs font-mono">
                    <p className="font-bold mb-1">{label}</p>
                    <p>Score: <span className="font-bold">{payload[0].value}%</span></p>
                </div>
            );
        }
        return null;
    };

    // Custom Dot to match the black dots in the reference image
    const CustomDot = (props) => {
        const { cx, cy, stroke, payload, value } = props;
        return (
            <circle cx={cx} cy={cy} r={4} stroke="none" fill="#18181b" /> // Zinc-950 black
        );
    };

    return (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 relative overflow-hidden text-zinc-900">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-600" />
                        Habit Velocity
                    </h2>
                    <p className="text-sm text-zinc-500">Realtime progress trajectory</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-indigo-600">
                        {data.length > 0 ? data[data.length - 1].percentage : 0}
                        <span className="text-sm font-normal text-zinc-400 ml-1">%</span>
                    </div>
                </div>
            </div>

            <div className="h-64 w-full bg-zinc-50 rounded-xl border border-zinc-100 p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        {/* Grid lines similar to graph paper */}
                        <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                        <XAxis
                            dataKey="date"
                            stroke="#71717a"
                            tick={{ fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={true}
                        />
                        <YAxis
                            stroke="#71717a"
                            tick={{ fontSize: 10, fontFamily: 'monospace' }}
                            tickLine={false}
                            axisLine={true}
                            domain={[0, 100]}
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* 
                            Multicolor line simulation:
                            We can use a linear gradient if it tracks Y value, 
                            but the reference image has segments of different colors.
                            Recharts doesn't support multicolor segments easily based on index.
                            We'll use a strong gradient stroke to look cool.
                        */}
                        <defs>
                            <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#818cf8" /> {/* Indigo-400 */}
                                <stop offset="50%" stopColor="#34d399" /> {/* Emerald-400 */}
                                <stop offset="100%" stopColor="#f472b6" /> {/* Pink-400 */}
                            </linearGradient>
                        </defs>

                        <Line
                            type="linear" // Sharp angles like the reference image
                            dataKey="percentage"
                            stroke="url(#lineColor)"
                            strokeWidth={3}
                            dot={<CustomDot />}
                            activeDot={{ r: 6, fill: '#000' }}
                            isAnimationActive={true}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
