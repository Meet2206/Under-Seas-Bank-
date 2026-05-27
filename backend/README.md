# 🏦 Banking System API

A backend banking system built with **FastAPI**, **PostgreSQL**, and **SQLAlchemy** that simulates core banking operations such as user authentication, account management, and secure money transfers.

This project demonstrates backend architecture, database design, authentication, and transaction handling similar to real-world fintech systems.

---

# 🚀 Features

### 🔐 Authentication

* User registration
* Secure login using MPIN
* JWT-based authentication
* Protected endpoints

### 👤 User Management

* Register new users
* Login with phone number + MPIN
* Account locking on repeated failures (if implemented)

### 🏦 Account Management

* Create bank accounts
* Unique account number generation
* Account balance tracking
* Link accounts to users

### 💸 Money Transfers

* Transfer money between accounts
* Balance validation
* Transaction recording

### 🧾 Transactions

* Record transfer history
* Store sender, receiver, amount, and timestamp
* Transaction status tracking

---

# 🛠 Tech Stack

| Technology | Purpose           |
| ---------- | ----------------- |
| FastAPI    | Backend framework |
| PostgreSQL | Database          |
| SQLAlchemy | ORM               |
| Pydantic   | Data validation   |
| JWT        | Authentication    |
| Uvicorn    | ASGI server       |

---

# 📂 Project Structure

```
app/
│
├── models/            # Database models
│   ├── user_model.py
│   ├── account_model.py
│   └── transaction_model.py
│
├── schemas/           # Request/response schemas
│
├── routes/            # API endpoints
│   ├── auth_routes.py
│   ├── account_routes.py
│   └── transaction_routes.py
│
├── services/          # Business logic
│
├── middleware/        # Authentication middleware
│
├── utils/             # Helper utilities (JWT, hashing)
│
├── database.py        # Database connection
└── main.py            # FastAPI application entry
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```
git clone https://github.com/yourusername/banking-system-api.git
cd banking-system-api
```

## 2️⃣ Create Virtual Environment

```
python -m venv venv
source venv/bin/activate
```

Windows:

```
venv\Scripts\activate
```

## 3️⃣ Install Dependencies

```
pip install -r requirements.txt
```

---

# 🗄 Database Setup

Ensure PostgreSQL is installed.

Create a database:

```
CREATE DATABASE banking_system;
```

Update database configuration inside:

```
app/database.py
```

Example connection:

```
postgresql://username:password@localhost:5432/banking_system
```

---

# ▶️ Run the Application

From the project root:

```bash
cd backend
```

Use a fresh virtual environment in this folder. This avoids accidentally running global Python packages or an old moved `venv`.

```bash
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

Start the server:

```
uvicorn app.main:app --reload
```

Server runs at:

```
http://127.0.0.1:8000
```

API documentation available at:

```
http://127.0.0.1:8000/docs
```

Important command format:

```bash
uvicorn app.main:app --reload
```

Do not use:

```bash
uvicorn --main.app
```

`app.main:app` means:

- `app`: backend package folder
- `main`: `backend/app/main.py`
- `app`: FastAPI object inside `main.py`

If you see `ModuleNotFoundError: No module named 'dotenv'`, you are not using the project environment or dependencies are not installed. Run:

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

If `backend/venv/bin/uvicorn` points to an old folder path, recreate the virtual environment:

```bash
cd backend
deactivate 2>/dev/null || true
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

---

# 🧪 Example API Flow

### 1️⃣ Register User

`POST /auth/register`

```
{
  "name": "Test User",
  "email": "test@test.com",
  "phone_number": "9000000001",
  "mpin": "1234"
}
```

---

### 2️⃣ Login

`POST /auth/login`

```
{
  "phone_number": "9000000001",
  "mpin": "1234"
}
```

Returns:

```
{
  "access_token": "...",
  "token_type": "bearer"
}
```

Use this token to authorize requests.

---

### 3️⃣ Create Bank Account

`POST /accounts/create`

```
{
  "account_type": "savings"
}
```

---

### 4️⃣ Transfer Money

`POST /transactions/transfer`

```
{
  "receiver_account": "1234567890",
  "amount": 200
}
```

---

# 🔒 Security Considerations

* Password/MPIN hashing
* JWT authentication
* Authorization middleware
* Input validation via Pydantic
* Database constraints

---

# 📈 Future Improvements

* Transaction history endpoint
* Beneficiary management
* Loan system
* Credit card module
* Rate limiting
* Unit and integration tests
* Docker deployment

---

# 📜 License

This project is for educational and portfolio purposes.

---

# 👨‍💻 Author

Meet Limbachiya
AI/ML Engineer | Python | FastAPI
