import { useEffect, useState } from "react"
import { getTransactions } from "../services/api"

export default function TransactionTable({ accountId }) {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const data = await getTransactions(accountId)
                setTransactions(data)
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }
        if (accountId) load()
    }, [accountId])

    if (loading) return <p className="loading-text" style={{ padding: "20px" }}>Loading activity...</p>
    
    if (transactions.length === 0) return (
        <div className="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p>No recent activity found.</p>
        </div>
    )

    return (
        <div className="data-table-wrapper" style={{ border: "none", boxShadow: "none", padding: "0 24px 24px" }}>
            <table style={{ borderCollapse: "separate", borderSpacing: "0 12px" }}>
                <thead>
                    <tr style={{ background: "transparent" }}>
                        <th style={{ border: "none", padding: "0 0 8px" }}>Detail</th>
                        <th style={{ border: "none", padding: "0 0 8px", textAlign: "right" }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.slice(0, 5).map((t) => (
                        <tr key={t.id} style={{ background: "var(--gray-50)", borderRadius: "12px", transition: "all 0.2s ease" }}>
                            <td style={{ border: "none", borderRadius: "12px 0 0 12px", padding: "12px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                    <div style={{ 
                                        width: "40px", 
                                        height: "40px", 
                                        borderRadius: "50%", 
                                        background: t.transaction_type === 'Deposit' ? '#ecfdf5' : '#fef2f2',
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        {t.transaction_type === 'Deposit' ? (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><path d="M7 13l5 5 5-5M12 18V6"/></svg>
                                        ) : (
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M7 11l5-5 5 5M12 6v12"/></svg>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: "600", color: "var(--navy-900)", fontSize: "14px" }}>{t.transaction_type}</div>
                                        <div style={{ fontSize: "11px", color: "var(--gray-400)" }}>Mar 18 • #{t.id.toString().slice(-4)}</div>
                                    </div>
                                </div>
                            </td>
                            <td style={{ border: "none", borderRadius: "0 12px 12px 0", padding: "12px 16px", textAlign: "right" }}>
                                <span style={{ 
                                    fontWeight: "700", 
                                    fontSize: "15px",
                                    color: t.transaction_type === 'Deposit' ? 'var(--success)' : 'var(--navy-900)'
                                }}>
                                    {t.transaction_type === 'Deposit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}