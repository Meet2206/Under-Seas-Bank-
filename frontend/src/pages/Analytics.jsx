import { useEffect, useState } from "react"
import MainLayout from "../layout/MainLayout"
import { getAnalytics } from "../services/api"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export default function Analytics() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const res = await getAnalytics()
                if (Array.isArray(res)) {
                    setData(res)
                } else if (res.expenses) {
                    setData(res.expenses)
                }
            } catch (e) {
                console.log("Analytics error:", e.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const totalExpense = data.reduce((acc, item) => acc + item.value, 0)

    return (
        <MainLayout title="Financial Analytics" subtitle="Insights into your spending habits and financial health">
            <div className="grid-2">
                <div className="chart-box" style={{ minHeight: "450px", display: "flex", flexDirection: "column" }}>
                    <div className="panel-header" style={{ marginBottom: "0" }}>
                        <h3>Expense Breakdown</h3>
                        <div className="badge badge-info">Monthly View</div>
                    </div>

                    {loading ? (
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <p className="loading-text">Analyzing your finances...</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="empty-state" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                            <p>No transaction data to analyze yet.</p>
                        </div>
                    ) : (
                        <div style={{ flex: 1, position: "relative" }}>
                            <ResponsiveContainer width="100%" height={350}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="category"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", pointerEvents: "none" }}>
                                <span style={{ fontSize: "12px", color: "var(--gray-400)", fontWeight: "600", textTransform: "uppercase" }}>Total</span>
                                <div style={{ fontSize: "28px", fontWeight: "800", color: "var(--navy-900)" }}>₹{totalExpense.toLocaleString()}</div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="panel">
                    <h3>Summary & Insights</h3>
                    
                    {data.length > 0 ? (
                        <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            {data.map((item, i) => (
                                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", borderRadius: "10px", background: "var(--gray-50)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: COLORS[i % COLORS.length] }}></div>
                                        <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--gray-700)" }}>{item.category}</span>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "14px", fontWeight: "700", color: "var(--navy-900)" }}>₹{item.value.toLocaleString()}</span>
                                        <span style={{ display: "block", fontSize: "11px", color: "var(--gray-400)" }}>{Math.round((item.value / totalExpense) * 100)}% of total</span>
                                    </div>
                                </div>
                            ))}

                            <div style={{ marginTop: "20px", padding: "16px", background: "linear-gradient(135deg, var(--teal-500), var(--teal-400))", borderRadius: "12px", color: "white" }}>
                                <p style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.8 }}>AI Insight</p>
                                <p style={{ fontSize: "14px", fontWeight: "500", marginTop: "8px", lineHeight: "1.5" }}>
                                    Your spending on <strong>{data.sort((a,b) => b.value - a.value)[0]?.category}</strong> is your highest category this month. Consider setting a budget to save more!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="empty-state">No insights available.</p>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}