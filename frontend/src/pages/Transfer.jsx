import { useState, useEffect } from "react"
import MainLayout from "../layout/MainLayout"
import { transferMoney, deposit, withdraw, getAccounts } from "../services/api"

export default function Transfer() {
    const [accounts, setAccounts] = useState([])
    const [mode, setMode] = useState("transfer") // transfer, deposit, withdraw
    const [loading, setLoading] = useState(false)

    // Transfer fields
    const [fromAccount, setFromAccount] = useState("")
    const [toAccount, setToAccount] = useState("")
    const [amount, setAmount] = useState("")

    // Deposit / Withdraw fields
    const [selectedAccount, setSelectedAccount] = useState("")
    const [dwAmount, setDwAmount] = useState("")

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAccounts()
                setAccounts(data)
            } catch (err) {
                console.log(err)
            }
        }
        load()
    }, [])

    const handleAction = async (actionFn, fields) => {
        setLoading(true)
        try {
            await actionFn(fields)
            alert("Success!")
            // Reset fields
            setAmount("")
            setDwAmount("")
            // Refresh accounts
            const data = await getAccounts()
            setAccounts(data)
        } catch (err) {
            alert(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout title="Money Operations" subtitle="Transfer, deposit, or withdraw funds securely">
            <div className="btn-group">
                <button
                    className={`btn-tab ${mode === "transfer" ? "active" : ""}`}
                    onClick={() => setMode("transfer")}
                >
                    Transfer
                </button>
                <button
                    className={`btn-tab ${mode === "deposit" ? "active" : ""}`}
                    onClick={() => setMode("deposit")}
                >
                    Deposit
                </button>
                <button
                    className={`btn-tab ${mode === "withdraw" ? "active" : ""}`}
                    onClick={() => setMode("withdraw")}
                >
                    Withdraw
                </button>
            </div>

            <div className="grid-2-1">
                <div className="form-section">
                    <h3>{mode.charAt(0).toUpperCase() + mode.slice(1)} Funds</h3>

                    {mode === "transfer" ? (
                        <>
                            <div className="form-field">
                                <label>From Account</label>
                                <select value={fromAccount} onChange={(e) => setFromAccount(e.target.value)}>
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>{acc.account_type} - {acc.account_number} (₹{acc.balance})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Recipient Account ID</label>
                                <input
                                    type="number"
                                    placeholder="Enter 10-digit ID"
                                    value={toAccount}
                                    onChange={(e) => setToAccount(e.target.value)}
                                />
                            </div>
                            <div className="form-field">
                                <label>Amount (INR)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => handleAction(transferMoney, { from_account_id: Number(fromAccount), to_account_id: Number(toAccount), amount: Number(amount) })}
                                style={{ width: "100%", justifyContent: "center" }}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : "Transfer Now"}
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="form-field">
                                <label>Select Account</label>
                                <select value={selectedAccount} onChange={(e) => setSelectedAccount(e.target.value)}>
                                    <option value="">Select Account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>{acc.account_type} - {acc.account_number} (₹{acc.balance})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-field">
                                <label>Amount (INR)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    value={dwAmount}
                                    onChange={(e) => setDwAmount(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => mode === "deposit"
                                    ? handleAction(deposit, { account_id: Number(selectedAccount), amount: Number(dwAmount) })
                                    : handleAction(withdraw, { account_id: Number(selectedAccount), amount: Number(dwAmount) })
                                }
                                style={{ width: "100%", justifyContent: "center" }}
                                disabled={loading}
                            >
                                {loading ? "Processing..." : mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                        </>
                    )}
                </div>

                <div className="panel">
                    <h3>Quick Tips</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <div className="stat-card-icon teal" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--gray-600)", lineHeight: "1.5" }}>
                                <strong>Secure Transfers:</strong> Always double-check the recipient's account ID before confirming.
                            </p>
                        </div>
                        <div style={{ display: "flex", gap: "12px" }}>
                            <div className="stat-card-icon teal" style={{ width: "32px", height: "32px", flexShrink: 0 }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                            </div>
                            <p style={{ fontSize: "12px", color: "var(--gray-600)", lineHeight: "1.5" }}>
                                <strong>Instant Settlement:</strong> Transfers within Underseas Bank are instant and free of charge.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}