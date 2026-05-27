import { Link, useLocation, useNavigate } from "react-router-dom"


export default function Sidebar() {

    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => location.pathname === path


    const handleLogout = () => {

        localStorage.removeItem("token")
        navigate("/")

    }


    return (

        <div className="sidebar">

            {/* Logo */}
            <div className="sidebar-logo">

                <div className="sidebar-logo-icon">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7v2h20V7L12 2zM4 11v7c0 2.21 3.58 4 8 4s8-1.79 8-4v-7H4zm8 9c-3.87 0-6-1.35-6-2v-4.47C7.36 14.43 9.53 15 12 15s4.64-.57 6-1.47V18c0 .65-2.13 2-6 2z" />
                    </svg>
                </div>

                <div className="sidebar-logo-text">
                    <h2>Underseas Bank</h2>
                    <span>Digital Banking</span>
                </div>

            </div>


            {/* Navigation */}
            <nav className="sidebar-nav">

                <div className="sidebar-section-label">Main</div>

                <Link to="/dashboard" className={`sidebar-link ${isActive("/dashboard") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
                    Dashboard
                </Link>

                <Link to="/accounts" className={`sidebar-link ${isActive("/accounts") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" /><path d="M16 2v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V2" /></svg>
                    Accounts
                </Link>

                <Link to="/analytics" className={`sidebar-link ${isActive("/analytics") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    Analytics
                </Link>


                <div className="sidebar-section-label">Banking</div>

                <Link to="/transfer" className={`sidebar-link ${isActive("/transfer") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    Transfer
                </Link>

                <Link to="/transactions" className={`sidebar-link ${isActive("/transactions") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
                    Transactions
                </Link>


                <div className="sidebar-section-label">Products</div>

                <Link to="/loans" className={`sidebar-link ${isActive("/loans") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                    Loans
                </Link>

                <Link to="/fd" className={`sidebar-link ${isActive("/fd") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M12 12h.01" /><path d="M17 12h.01" /><path d="M7 12h.01" /></svg>
                    Fixed Deposits
                </Link>

                <Link to="/credit-card" className={`sidebar-link ${isActive("/credit-card") ? "active" : ""}`}>
                    <svg viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                    Credit Card
                </Link>

            </nav>


            {/* Footer — Logout */}
            <div className="sidebar-footer">

                <div className="sidebar-link" onClick={handleLogout}>
                    <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Sign Out
                </div>

                <div className="sidebar-status">
                    <div className="status-dot"></div>
                    <span>All systems operational</span>
                </div>

            </div>

        </div>

    )

}