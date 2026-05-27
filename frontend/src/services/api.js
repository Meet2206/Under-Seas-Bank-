const API = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000").replace(/\/$/, "")


// ─── Helper: authenticated fetch ───
const authFetch = async (url, options = {}) => {

    const token = localStorage.getItem("token")

    const res = await fetch(`${API}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...(options.headers || {})
        }
    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.detail || "Request failed")
    }

    return result
}


// ═══════════════════════════════════
//  AUTH
// ═══════════════════════════════════

// LOGIN
export const login = async (data) => {

    const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.detail || "Login failed")
    }

    return result
}

// REGISTER
export const register = async (data) => {

    const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
        throw new Error(result.detail || "Registration failed")
    }

    return result
}

// GET CURRENT USER PROFILE
export const getMe = () => authFetch("/auth/me")


// ═══════════════════════════════════
//  ACCOUNTS
// ═══════════════════════════════════

// GET USER ACCOUNTS (fixed: /accounts → /accounts/my-accounts)
export const getAccounts = () => authFetch("/accounts/my-accounts")

// CREATE ACCOUNT
export const createAccount = (account_type) =>
    authFetch("/accounts/create", {
        method: "POST",
        body: JSON.stringify({ account_type })
    })

// GET ACCOUNT STATEMENT
export const getStatement = (accountId) =>
    authFetch(`/accounts/statement/${accountId}`)

// GET PASSBOOK
export const getPassbook = (accountId) =>
    authFetch(`/accounts/passbook/${accountId}`)


// ═══════════════════════════════════
//  TRANSACTIONS
// ═══════════════════════════════════

// TRANSFER
export const transferMoney = (data) =>
    authFetch("/transactions/transfer", {
        method: "POST",
        body: JSON.stringify(data)
    })

// DEPOSIT
export const deposit = (data) =>
    authFetch("/transactions/deposit", {
        method: "POST",
        body: JSON.stringify(data)
    })

// WITHDRAW
export const withdraw = (data) =>
    authFetch("/transactions/withdraw", {
        method: "POST",
        body: JSON.stringify(data)
    })

// GET TRANSACTION HISTORY
export const getTransactions = (accountId) =>
    authFetch(`/transactions/history/${accountId}`)


// ═══════════════════════════════════
//  LOANS
// ═══════════════════════════════════

// APPLY LOAN (fixed: now includes account_id)
export const applyLoan = (data) =>
    authFetch("/loans/apply", {
        method: "POST",
        body: JSON.stringify(data)
    })

// LIST MY LOANS
export const getMyLoans = () => authFetch("/loans/my")

// PAY EMI
export const payEMI = (data) =>
    authFetch("/loans/pay", {
        method: "POST",
        body: JSON.stringify(data)
    })


// ═══════════════════════════════════
//  FIXED DEPOSITS
// ═══════════════════════════════════

// CREATE FD (fixed: field names → principal_amount, duration_months, account_id)
export const createFD = (data) =>
    authFetch("/fd/create", {
        method: "POST",
        body: JSON.stringify(data)
    })

// LIST MY FDs
export const getMyFDs = () => authFetch("/fd/my")

// CLOSE FD
export const closeFD = (fdId) =>
    authFetch(`/fd/close/${fdId}`, { method: "POST" })


// ═══════════════════════════════════
//  CREDIT CARD
// ═══════════════════════════════════

// APPLY CREDIT CARD (fixed: now sends { account_id, credit_limit })
export const applyCreditCard = (data) =>
    authFetch("/credit-card/apply", {
        method: "POST",
        body: JSON.stringify(data)
    })

// LIST MY CARDS
export const getCreditCards = () => authFetch("/credit-card/my")

// MAKE PURCHASE
export const creditPurchase = (data) =>
    authFetch("/credit-card/purchase", {
        method: "POST",
        body: JSON.stringify(data)
    })

// PAY CREDIT CARD BILL
export const payCreditBill = (data) =>
    authFetch("/credit-card/pay", {
        method: "POST",
        body: JSON.stringify(data)
    })


// ═══════════════════════════════════
//  BENEFICIARIES
// ═══════════════════════════════════

// ADD BENEFICIARY
export const addBeneficiary = (data) =>
    authFetch("/beneficiaries/add", {
        method: "POST",
        body: JSON.stringify(data)
    })

// LIST MY BENEFICIARIES
export const getBeneficiaries = () => authFetch("/beneficiaries/my")


// ═══════════════════════════════════
//  ANALYTICS
// ═══════════════════════════════════

// GET EXPENSE ANALYTICS (fixed: /analytics → /analytics/expenses)
export const getAnalytics = () => authFetch("/analytics/expenses")


// ═══════════════════════════════════
//  OTP VERIFICATION
// ═══════════════════════════════════

// SEND PHONE OTP
export const sendPhoneOTP = (phone_number) =>
    fetch(`${API}/auth/send-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number })
    }).then(async (res) => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.detail || "Failed to send OTP")
        return result
    })

// VERIFY PHONE OTP
export const verifyPhoneOTP = (phone_number, otp) =>
    fetch(`${API}/auth/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number, otp })
    }).then(async (res) => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.detail || "Verification failed")
        return result
    })

// SEND EMAIL OTP
export const sendEmailOTP = (email) =>
    fetch(`${API}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    }).then(async (res) => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.detail || "Failed to send OTP")
        return result
    })

// VERIFY EMAIL OTP
export const verifyEmailOTP = (email, otp) =>
    fetch(`${API}/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp })
    }).then(async (res) => {
        const result = await res.json()
        if (!res.ok) throw new Error(result.detail || "Verification failed")
        return result
    })
