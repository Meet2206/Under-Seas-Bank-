import { useState, useEffect } from "react"
import MainLayout from "../layout/MainLayout"
import { createFD, getMyFDs, getAccounts } from "../services/api"

export default function FixedDeposit() {
    const [accounts, setAccounts] = useState([])
    const [fds, setFds] = useState([])
    const [loading, setLoading] = useState(true)

    const [accountId, setAccountId] = useState("")
    const [amount, setAmount] = useState("")
    const [rate, setRate] = useState("6.5")
    const [months, setMonths] = useState("12")

    const loadData = async () => {
        try {
            const [accs, myFDs] = await Promise.all([
                getAccounts(),
                getMyFDs()
            ])
            setAccounts(accs)
            setFds(myFDs)
            if (accs.length > 0) setAccountId(accs[0].id)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const handleFD = async () => {
        try {
            await createFD({
                account_id: Number(accountId),
                principal_amount: Number(amount),
                interest_rate: Number(rate),
                duration_months: Number(months)
            })
            alert("Fixed Deposit created!")
            loadData()
            setAmount("")
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <MainLayout title="Fixed Deposits" subtitle="Secure your wealth with high-interest fixed term investments">
            <div className="grid-2-1">
                <div className="form-section">
                    <h3>Open New Fixed Deposit</h3>
                    
                    <div className="form-field">
                        <label>Source Account</label>
                        <select value={accountId} onChange={(e) => setAccountId(e.target.value)}>
                            <option value="">Select Account</option>
                            {accounts.map((acc) => (
                                <option key={acc.id} value={acc.id}>
                                    {acc.account_type} - {acc.account_number}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Principal Amount</label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-field">
                            <label>Annual Interest (% p.a.)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                disabled
                            />
                        </div>
                        <div className="form-field">
                            <label>Duration</label>
                            <select value={months} onChange={(e) => setMonths(e.target.value)}>
                                <option value="6">6 Months</option>
                                <option value="12">1 Year</option>
                                <option value="24">2 Year</option>
                                <option value="36">3 Year</option>
                                <option value="60">5 Year</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleFD} style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
                        Invest Now
                    </button>
                </div>

                <div className="panel">
                    <h3>Investment Value</h3>
                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ padding: "12px", background: "var(--success-bg)", borderRadius: "8px", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--success)" }}>Est. Maturity Amount</span>
                            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--navy-900)" }}>
                                ₹{amount ? (Number(amount) * (1 + (Number(rate)/100) * (Number(months)/12))).toFixed(2) : "0.00"}
                            </div>
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--gray-500)", lineHeight: "1.5" }}>
                            Underseas Bank 🛡️ Secure Deposit scheme is insured up to ₹250,000 for your peace of mind.
                        </p>
                    </div>
                </div>
            </div>

            <div className="data-table-wrapper" style={{ marginTop: "32px" }}>
                <div className="panel-header" style={{ marginBottom: "20px" }}>
                    <h3>Your Fixed Deposits</h3>
                    <span className="badge badge-success">{fds.length} Total</span>
                </div>
                
                {loading ? (
                    <p className="loading-text">Loading deposits...</p>
                ) : fds.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        <p>No active fixed deposits found.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Principal</th>
                                <th>Interest Rate</th>
                                <th>Duration</th>
                                <th>Maturity Amount</th>
                                <th style={{ textAlign: "right" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {fds.map((fd) => (
                                <tr key={fd.id}>
                                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>FD-{fd.id.toString().padStart(4, '0')}</td>
                                    <td><strong>₹{fd.principal_amount.toLocaleString()}</strong></td>
                                    <td>{fd.interest_rate}%</td>
                                    <td>{fd.duration_months} mo</td>
                                    <td><span style={{ color: "var(--success)", fontWeight: "700" }}>₹{fd.maturity_amount.toLocaleString()}</span></td>
                                    <td style={{ textAlign: "right" }}>
                                        <span className="badge badge-success">{fd.status || 'Active'}</span>
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