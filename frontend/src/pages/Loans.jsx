import { useState, useEffect } from "react"
import MainLayout from "../layout/MainLayout"
import { applyLoan, getMyLoans, getAccounts } from "../services/api"

export default function Loans() {
    const [accounts, setAccounts] = useState([])
    const [loans, setLoans] = useState([])
    const [loading, setLoading] = useState(true)

    const [accountId, setAccountId] = useState("")
    const [amount, setAmount] = useState("")
    const [rate, setRate] = useState("7.5")
    const [months, setMonths] = useState("12")

    const loadData = async () => {
        try {
            const [accs, lns] = await Promise.all([
                getAccounts(),
                getMyLoans()
            ])
            setAccounts(accs)
            setLoans(lns)
            if (accs.length > 0) setAccountId(accs[0].id)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const handleLoan = async () => {
        try {
            await applyLoan({
                account_id: Number(accountId),
                loan_amount: Number(amount),
                interest_rate: Number(rate),
                tenure_months: Number(months)
            })
            alert("Loan applied successfully!")
            loadData()
            setAmount("")
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <MainLayout title="Loans" subtitle="Fuel your future with Underseas Bank credit solutions">
            <div className="grid-2-1">
                <div className="form-section">
                    <h3>Apply for New Loan</h3>
                    
                    <div className="form-field">
                        <label>Account for Disbursement</label>
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
                        <label>Requested Loan Amount</label>
                        <input
                            type="number"
                            placeholder="Enter amount (e.g. 5000)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="grid-2">
                        <div className="form-field">
                            <label>Interest Rate (%)</label>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Tenure (Months)</label>
                            <select value={months} onChange={(e) => setMonths(e.target.value)}>
                                <option value="12">12 Months</option>
                                <option value="24">24 Months</option>
                                <option value="36">36 Months</option>
                                <option value="48">48 Months</option>
                                <option value="60">60 Months</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={handleLoan} style={{ width: "100%", justifyContent: "center", marginTop: "12px" }}>
                        Submit Application
                    </button>
                </div>

                <div className="panel">
                    <h3>Loan Calculator Info</h3>
                    <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div style={{ padding: "12px", background: "var(--gray-50)", borderRadius: "8px", border: "1px solid var(--gray-200)" }}>
                            <span style={{ fontSize: "11px", fontWeight: "700", textTransform: "uppercase", color: "var(--gray-400)" }}>Est. Monthly EMI</span>
                            <div style={{ fontSize: "20px", fontWeight: "700", color: "var(--navy-900)" }}>
                                ₹{amount ? (Number(amount) * (1 + (Number(rate)/100)) / Number(months)).toFixed(2) : "0.00"}
                            </div>
                        </div>
                        <p style={{ fontSize: "12px", color: "var(--gray-500)", lineHeight: "1.5" }}>
                            Your eligibility is based on your account history and maintaining a healthy balance. Terms and conditions apply.
                        </p>
                    </div>
                </div>
            </div>

            <div className="data-table-wrapper" style={{ marginTop: "32px" }}>
                <div className="panel-header" style={{ marginBottom: "20px" }}>
                    <h3>Your Active Loans</h3>
                    <span className="badge badge-info">{loans.length} Active</span>
                </div>
                
                {loading ? (
                    <p className="loading-text">Loading loans...</p>
                ) : loans.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        <p>No active loans found. Apply above to get started.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Ref ID</th>
                                <th>Principal</th>
                                <th>Interest Rate</th>
                                <th>Tenure</th>
                                <th>Monthly EMI</th>
                                <th>Balance Remaining</th>
                                <th style={{ textAlign: "right" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id}>
                                    <td style={{ fontFamily: "monospace", fontSize: "12px" }}>LN-{loan.id.toString().padStart(4, '0')}</td>
                                    <td><strong>₹{loan.loan_amount.toLocaleString()}</strong></td>
                                    <td>{loan.interest_rate}%</td>
                                    <td>{loan.tenure_months} mo</td>
                                    <td>₹{loan.emi_amount.toLocaleString()}</td>
                                    <td>₹{loan.remaining_balance.toLocaleString()}</td>
                                    <td style={{ textAlign: "right" }}>
                                        <span className={`badge ${loan.status === 'Active' ? 'badge-info' : 'badge-success'}`}>
                                            {loan.status}
                                        </span>
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