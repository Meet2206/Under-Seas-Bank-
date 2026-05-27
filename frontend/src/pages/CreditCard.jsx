import { useEffect, useState } from "react"
import MainLayout from "../layout/MainLayout"
import { applyCreditCard, getCreditCards, getAccounts } from "../services/api"

export default function CreditCard() {
    const [accounts, setAccounts] = useState([])
    const [cards, setCards] = useState([])
    const [loading, setLoading] = useState(true)

    const [accountId, setAccountId] = useState("")
    const [creditLimit, setCreditLimit] = useState("5000")

    const loadData = async () => {
        try {
            const [accs, myCards] = await Promise.all([
                getAccounts(),
                getCreditCards()
            ])
            setAccounts(accs)
            setCards(Array.isArray(myCards) ? myCards : (myCards ? [myCards] : []))
            if (accs.length > 0) setAccountId(accs[0].id)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { loadData() }, [])

    const apply = async () => {
        try {
            await applyCreditCard({
                account_id: Number(accountId),
                credit_limit: Number(creditLimit)
            })
            alert("Credit card application submitted!")
            loadData()
        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <MainLayout title="Credit Cards" subtitle="Unlock premium perks and smart spending power">
            <div className="grid-2-1">
                <div className="form-section">
                    <h3>Request Premium Card</h3>
                    
                    <div className="form-field">
                        <label>Linked Bank Account</label>
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
                        <label>Desired Credit Limit</label>
                        <select value={creditLimit} onChange={(e) => setCreditLimit(e.target.value)}>
                            <option value="1000">₹1,000 (Standard)</option>
                            <option value="5000">₹5,000 (Silver)</option>
                            <option value="10000">₹10,000 (Gold)</option>
                            <option value="25000">₹25,000 (Platinum)</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center" }}>
                        <div style={{ width: "24px", height: "16px", background: "gold", borderRadius: "2px" }}></div>
                        <span style={{ fontSize: "12px", color: "var(--gray-500)" }}>Enjoy 2% Cashback on all purchases</span>
                    </div>

                    <button onClick={apply} style={{ width: "100%", justifyContent: "center" }}>
                        Apply Now
                    </button>
                </div>

                <div className="panel" style={{ background: "linear-gradient(135deg, var(--gray-800), var(--gray-900))", color: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <span style={{ fontSize: "14px", fontWeight: "600", opacity: 0.8 }}>Underseas Card</span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                        </div>
                        <div style={{ marginTop: "40px", fontSize: "18px", letterSpacing: "2px", fontFamily: "monospace" }}>•••• •••• •••• 1234</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "10px", textTransform: "uppercase", opacity: 0.5 }}>Card Holder</div>
                        <div style={{ fontSize: "14px", fontWeight: "600" }}>VALUED CUSTOMER</div>
                    </div>
                </div>
            </div>

            <div className="data-table-wrapper" style={{ marginTop: "32px" }}>
                <div className="panel-header" style={{ marginBottom: "20px" }}>
                    <h3>Existing Credit Cards</h3>
                    <span className="badge badge-info">{cards.length} Total</span>
                </div>
                
                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : cards.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                        <p>No credit cards issued yet.</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Card Number</th>
                                <th>Total Limit</th>
                                <th>Utilized</th>
                                <th>Available Credit</th>
                                <th style={{ textAlign: "right" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cards.map((card) => (
                                <tr key={card.id}>
                                    <td style={{ fontFamily: "monospace" }}>{card.card_number}</td>
                                    <td><strong>₹{card.credit_limit.toLocaleString()}</strong></td>
                                    <td style={{ color: "var(--danger)" }}>₹{card.used_credit.toLocaleString()}</td>
                                    <td><span style={{ color: "var(--success)", fontWeight: "700" }}>₹{(card.credit_limit - card.used_credit).toLocaleString()}</span></td>
                                    <td style={{ textAlign: "right" }}>
                                        <span className={`badge ${card.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                                            {card.status}
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