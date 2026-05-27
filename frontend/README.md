# 🖥 Under Seas Bank Frontend

Modern **Digital Banking Dashboard UI** built with **React + Vite**

<p align="center">

![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge\&logo=react)
![Vite](https://img.shields.io/badge/Vite-BuildTool-purple?style=for-the-badge\&logo=vite)
![Recharts](https://img.shields.io/badge/Recharts-Analytics-orange?style=for-the-badge)


</p>

# ✨ Frontend Features

### 🔐 Authentication UI

• MPIN Login screen
• Secure JWT token storage
• API authentication handling

### 🏦 Accounts Dashboard

Users can:

• create accounts
• view balances
• manage multiple accounts

Dashboard automatically calculates:

```
Total Balance
Accounts Count
Loans
Investments
```
### 💸 Transfer System

UI allows:

```
Deposit
Withdraw
Transfer
```

Transfer page communicates with:

```
POST /transactions/transfer
```

### 📜 Passbook Style Transactions

Users can view:

```
Transaction History
Deposits
Withdrawals
Transfers
```

Displayed in a **table format similar to bank statements**.

### 📈 Analytics Dashboard

Analytics page shows:

```
Expense breakdown
Financial health score
Category spending
```

Charts powered by:

```
Recharts
```

Example chart:

```
Expense Pie Chart
```
### 💰 Fixed Deposits

Users can:

```
Create FD
Track interest
View maturity
```
### 💳 Credit Cards

Users can:

```
View credit limit
Used credit
Remaining balance
```
### 🏦 Loans

Loan UI supports:

```
Loan applications
EMI calculation
Loan tracking
```
# 🎨 UI Design

The dashboard uses **modern fintech UI patterns**.

### Glassmorphism Cards

```css
.card {
 background: rgba(255,255,255,0.7);
 backdrop-filter: blur(10px);
 border-radius: 14px;
 box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}
```

This creates a **glass card effect** used in modern dashboards.

### Gradient Dashboard Background

```css
body {
 background: linear-gradient(
 135deg,
 #f5f7fb,
 #eef2ff
 );
}
```

# 🧠 Frontend Architecture

```
                 React App
                     │
                     │
                React Router
                     │
 ┌───────────────┬───────────────┬───────────────┐
 │               │               │               │
Pages         Layout         Components        Services
 │               │               │               │
Dashboard     Sidebar       Card.jsx           API.js
Accounts      Navbar        Charts             Auth API
Transfer                     Tables             Banking APIs
Loans
Analytics
```
# 📂 Project Structure

```
frontend
│
├── src
│
├── pages
│   ├── Dashboard.jsx
│   ├── Accounts.jsx
│   ├── Transfer.jsx
│   ├── Transactions.jsx
│   ├── Loans.jsx
│   ├── FD.jsx
│   ├── CreditCard.jsx
│   └── Analytics.jsx
│
├── components
│   ├── Card.jsx
│   ├── ExpenseChart.jsx
│   └── TransactionTable.jsx
│
├── layout
│   ├── MainLayout.jsx
│   └── Sidebar.jsx
│
├── services
│   └── api.js
│
├── App.jsx
├── main.jsx
└── index.css
```
# 🔌 Backend Communication

All API requests go through:

```
src/services/api.js
```

Example login request:

```javascript
const API = "http://127.0.0.1:8000"

export const login = async (data) => {

 const res = await fetch(`${API}/auth/login`, {
  method: "POST",
  headers: {
   "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
 })

 return res.json()
}
```

JWT token stored in:

```
localStorage
```

Example protected request:

```javascript
Authorization: Bearer <token>
```

# 📊 Dashboard Flow

```
User Login
     │
     ▼
Fetch Accounts
     │
     ▼
Calculate Total Balance
     │
     ▼
Load Analytics
     │
     ▼
Load Transactions
```

# 🚀 Running Frontend

Navigate to frontend folder:

```
cd frontend
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

# 🔗 Backend Requirement

Backend API must be running.

Default backend URL:

```
http://127.0.0.1:8000
```

API documentation:

```
http://127.0.0.1:8000/docs
```

# 🧩 Integrations

Frontend integrates with:

```
Authentication API
Accounts API
Transactions API
Loan API
FD API
Credit Card API
Analytics API
```

# 📈 Future UI Improvements

Possible upgrades:

```
Realtime transactions
Mobile responsive layout
Dark mode
Notification center
Interactive analytics
```
# 👨‍💻 Author

Meet Limbachiya
B.Tech CSE — Artificial Intelligence & Data Science
# ⭐ Support

If you like this project:

⭐ Star the repository
