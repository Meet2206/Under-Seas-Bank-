import { useEffect, useState } from "react"
import MainLayout from "../layout/MainLayout"
import { getAccounts, createAccount } from "../services/api"

export default function Accounts() {
    const [accounts, setAccounts] = useState([])
    const [accountType, setAccountType] = useState("Savings")
    const [loading, setLoading] = useState(true)

    const loadAccounts = async () => {
        try {
            const data = await getAccounts()
            setAccounts(data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadAccounts()
    }, [])

    const handleCreate = async () => {
        try {
            await createAccount(accountType)
            alert("Account created successfully!")
            loadAccounts()
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <MainLayout title="My Accounts" subtitle="Manage your various bank accounts and balances">
            <div className="grid-2-1">
                <div className="panel">
                    <div className="panel-header">
                        <h3>Your Bank Accounts</h3>
                        <span className="view-all">{accounts.length} Total</span>
                    </div>

                    {loading ? (
                        <p className="loading-text">Loading your accounts...</p>
                    ) : accounts.length === 0 ? (
                        <div className="empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            <p>No accounts found. Create your first one!</p>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {accounts.map((acc) => (
                                <div key={acc.id} className="stat-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                        <div className="stat-card-icon blue">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="2" y="5" width="20" height="14" rx="2" />
                                                <line x1="2" y1="10" x2="22" y2="10" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 style={{ marginBottom: "0", color: "var(--gray-900)", fontSize: "14px", fontWeight: "600" }}>{acc.account_type} Account</h4>
                                            <span style={{ fontSize: "12px", color: "var(--gray-400)" }}>{acc.account_number}</span>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div className="stat-value" style={{ fontSize: "20px" }}>₹{acc.balance.toLocaleString()}</div>
                                        <span className="badge badge-success">Active</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <h3>Open New Account</h3>
                    <div className="form-field">
                        <label>Account Type</label>
                        <select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}
                        >
                            <option value="Savings">Savings Account</option>
                            <option value="Current">Current Account</option>
                            <option value="Salary">Salary Account</option>
                        </select>
                    </div>
                    <button onClick={handleCreate} style={{ width: "100%", justifyContent: "center" }}>
                        Create Account
                    </button>
                    
                    <div style={{ marginTop: "24px", padding: "16px", background: "var(--info-bg)", borderRadius: "var(--border-radius-xs)", border: "1px solid rgba(59, 130, 246, 0.2)" }}>
                        <p style={{ fontSize: "12px", color: "var(--info)", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                            Did you know?
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--gray-600)", marginTop: "4px", lineHeight: "1.4" }}>
                            Savings accounts earn a 4.5% annual interest rate, paid out monthly.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}