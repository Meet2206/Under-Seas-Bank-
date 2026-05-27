import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Accounts from "./pages/Accounts"
import Transfer from "./pages/Transfer"
import Transactions from "./pages/Transactions"
import Loans from "./pages/Loans"
import FixedDeposit from "./pages/FixedDeposit"
import CreditCard from "./pages/CreditCard"
import Analytics from "./pages/Analytics"


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/accounts" element={<Accounts />} />

        <Route path="/transfer" element={<Transfer />} />

        <Route path="/transactions" element={<Transactions />} />

        <Route path="/loans" element={<Loans />} />

        <Route path="/fd" element={<FixedDeposit />} />

        <Route path="/credit-card" element={<CreditCard />} />

        <Route path="/analytics" element={<Analytics />} />

      </Routes>

    </BrowserRouter>

  )

}

export default App