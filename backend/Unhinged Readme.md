# 🏦 Under Seas Bank — A Completely Responsible Banking System

Welcome to **Under Seas Bank**, a backend banking API built with FastAPI and PostgreSQL.

It allows users to create accounts, authenticate themselves, and transfer money between accounts like a responsible adult… except the money is fake and the responsibility is questionable.

---

# 🧠 Why This Exists

I wanted to learn how real banking systems work.

So naturally I built one that:

* authenticates users
* creates accounts
* moves money
* records transactions

All without regulators, auditors, or a board of directors asking uncomfortable questions.

---

# ⚡ Features

### 🔐 Authentication

* Register users
* Login using phone number + MPIN
* JWT based authentication
* Protected endpoints

### 🏦 Accounts

* Create bank accounts
* Auto-generated account numbers
* Balance tracking

### 💸 Transfers

* Send money between accounts
* Prevent overdrafts
* Record every transfer

### 🧾 Transactions

* Store transfer history
* Track sender and receiver
* Timestamped records

---

# 🧰 Tech Stack

| Tech       | Why                       |
| ---------- | ------------------------- |
| FastAPI    | Fast Python APIs          |
| PostgreSQL | Real database (not vibes) |
| SQLAlchemy | ORM                       |
| Pydantic   | Validation                |
| JWT        | Authentication            |
| Uvicorn    | ASGI server               |

---

# 📂 Project Structure

```text
app/
├── models/
├── schemas/
├── routes/
├── services/
├── middleware/
├── utils/
├── database.py
└── main.py
```

A beautiful architecture that will inevitably be broken by future feature requests.

---

# 🚀 Running The Project

### Clone the repo

```bash
git clone https://github.com/yourusername/bank.py
cd bank.py
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run server

```bash
uvicorn app.main:app --reload
```

Then open:

```
http://127.0.0.1:8000/docs
```

Where Swagger UI lets you simulate financial power you absolutely do not have in real life.

---

# 🧪 Example API Flow

### Register

```json
POST /auth/register
{
 "name": "Test User",
 "email": "test@test.com",
 "phone_number": "9000000001",
 "mpin": "1234"
}
```

---

### Login

```json
POST /auth/login
{
 "phone_number": "9000000001",
 "mpin": "1234"
}
```

Returns a JWT token proving that you are now a **trusted financial entity**.

---

### Create Account

```json
POST /accounts/create
{
 "account_type": "savings"
}
```

You now possess a powerful database row.

---

### Transfer Money

```json
POST /transactions/transfer
{
 "receiver_account": "1234567890",
 "amount": 200
}
```

Congratulations. You have moved numbers between tables.

---

# 🔒 Security

This system includes:

* MPIN hashing
* JWT authentication
* Request validation
* Protected routes

Which means it is **significantly more secure than most college projects**.

---

# ⚠️ Disclaimer

This is **not a real bank**.

If you try to:

* deposit real money
* pay bills
* buy a yacht

The database will simply stare at you in confusion.

---

# 👨‍💻 Author

**Meet Limbachiya**

Backend developer who built a banking system
without having access to actual money.

Ironically appropriate.
