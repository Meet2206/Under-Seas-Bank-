import { useEffect, useState } from "react"
import MainLayout from "../layout/MainLayout"
import { getTransactions, getAccounts } from "../services/api"

export default function Transactions() {
    const [accounts, setAccounts] = useState([])
    const [accountId, setAccountId] = useState("")
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAccounts()
                setAccounts(data)
                if (data.length > 0) {
                    setAccountId(data[0].id)
                }
            } catch (err) {
                console.log(err)
            }
        }
        load()
    }, [])

    useEffect(() => {
        if (accountId) {
            loadTransactions()
        }
    }, [accountId])

    const loadTransactions = async () => {
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

    return (
        <MainLayout title="Transactions" subtitle="Review your account activity and history">
            <div className="panel" style={{ marginBottom: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div className="stat-card-icon blue" style={{ width: "40px", height: "40px" }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: "0" }}>Account Activity</h3>
                        <p style={{ fontSize: "12px", color: "var(--gray-400)" }}>Showing latest transactions for the selected account</p>
                    </div>
                </div>
                
                <div style={{ minWidth: "240px" }}>
                    <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                        <option value="">Select Account</option>
                        {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>{acc.account_type} - {acc.account_number}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="data-table-wrapper">
                {loading ? (
                    <div style={{ padding: "40px", textAlign: "center" }}>
                        <p className="loading-text">Fetching records...</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <p>No transactions found for this account.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Description / Type</th>
                                <th>Date</th>
                                <th style={{ textAlign: "right" }}>Amount</th>
                                <th style={{ textAlign: "right" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((t) => (
                                <tr key={t.id}>
                                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>#{t.id.toString().padStart(6, '0')}</td>
                                    <td>
                                        <div style={{ fontWeight: "600", color: "var(--navy-900)" }}>{t.transaction_type}</div>
                                        <span style={{ fontSize: "11px", color: "var(--gray-400)" }}>Underseas Digital Payment</span>
                                    </td>
                                    <td style={{ color: "var(--gray-500)", fontSize: "13px" }}>Mar 18, 2026</td>
                                    <td style={{ textAlign: "right", fontWeight: "700", color: t.transaction_type === 'Deposit' ? 'var(--success)' : 'var(--navy-900)' }}>
                                        {t.transaction_type === 'Deposit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                    </td>
                                    <td style={{ textAlign: "right" }}>
                                        <span className="badge badge-success">Completed</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </MainLayout>
    )
}