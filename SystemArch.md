# Under Seas Bank System Architecture

## Project Purpose

Under Seas Bank is a full-stack banking demo with a React frontend and a FastAPI backend. The application supports registration, login with MPIN, OTP verification, bank accounts, deposits, withdrawals, transfers, loans, fixed deposits, credit cards, beneficiaries, and spending analytics.

## Repository Layout

- `frontend/`: React single page application built with Vite.
- `frontend/src/services/api.js`: Central frontend API client. All browser-to-backend calls go through this file.
- `frontend/src/pages/`: Screen-level React components for login, dashboard, accounts, transfers, transactions, loans, fixed deposits, credit cards, and analytics.
- `frontend/src/components/`: Reusable UI pieces such as header, sidebar, card, chart, and transaction table.
- `frontend/src/layout/MainLayout.jsx`: Shared dashboard layout wrapping authenticated pages.
- `backend/`: FastAPI backend.
- `backend/app/main.py`: FastAPI application factory area. Registers middleware, health endpoints, and all routers.
- `backend/app/config.py`: Environment-backed settings object.
- `backend/app/database.py`: SQLAlchemy engine, session factory, declarative base, and request-scoped database dependency.
- `backend/app/routes/`: API route handlers. These validate request flow, inject database sessions, check authenticated users, and call services.
- `backend/app/services/`: Business logic for authentication, accounts, transactions, loans, fixed deposits, credit cards, email, and OTP.
- `backend/app/models/`: SQLAlchemy ORM table models.
- `backend/app/schemas/`: Pydantic request and response schemas.
- `backend/app/utils/`: Shared utilities for password hashing, JWT, encryption, lookup hashes, and EMI calculations.
- `backend/app/analytics/`: Expense analysis, financial health calculation, and tip generation helpers.
- `backend/app/tasks/`: Celery task wrappers for email jobs.
- `backend/docker/`: Dockerfile and docker-compose setup for backend, PostgreSQL, Redis, and worker services.
- `backend/nginx/`: Reverse proxy configuration for the FastAPI app.

## Backend Architecture

The backend is a layered Python application:

1. `main.py` creates the FastAPI app.
2. `config.py` loads settings from environment variables and `.env`.
3. `database.py` creates the SQLAlchemy connection engine and `get_db()` dependency.
4. Route modules expose HTTP endpoints using `APIRouter`.
5. Middleware helpers authenticate requests through JWT bearer tokens.
6. Services perform banking business rules and database updates.
7. Models define database tables.
8. Schemas define request and response shapes.
9. Utilities isolate repeated technical logic such as hashing, JWT, encryption, and calculations.

## Backend Python-Only and OOP Rule

The backend application source must stay strictly Python. Project-owned backend code should live under `backend/app` as `.py` files only.

Allowed backend code style:

- Python classes for domain structure, configuration, ORM models, request and response schemas, custom SQLAlchemy types, and future service objects.
- Python functions where FastAPI expects them, such as route handlers and dependency functions.
- Python modules for separating routes, services, models, schemas, utilities, analytics, tasks, and middleware.

Not allowed in project-owned backend code:

- Cython source files such as `.pyx` or `.pxd`.
- Cython build commands such as `cythonize`.
- C or C++ extension source files for app logic, such as `.c`, `.cpp`, `.so`, or `.pyd`.
- Python extension build declarations such as `Extension(...)` for backend app modules.
- C-extension bridges for app logic such as `pybind` or `cffi`.

Current OOP usage:

- `Settings` in `backend/app/config.py` is a Python configuration class.
- SQLAlchemy models such as `User`, `Account`, `Transaction`, `Loan`, `FixedDeposit`, `CreditCard`, `Beneficiary`, and `Notification` are Python ORM classes.
- Pydantic schemas are Python classes used for validation.
- `EncryptedString` is a Python class that customizes SQLAlchemy storage behavior.

Direction for future backend changes:

- Keep business concepts represented with Python classes where it improves structure.
- Prefer service classes for larger service areas if the backend grows.
- Keep route handlers thin so they mainly validate input, resolve dependencies, and call Python service logic.

## Backend Runtime Connections

- Frontend-to-backend: `frontend/src/services/api.js` uses `http://127.0.0.1:8000`.
- Hosted frontend-to-backend: `frontend/src/services/api.js` reads `VITE_API_BASE_URL`, so production builds can point to the hosted backend URL.
- CORS: `backend/app/main.py` allows origins from `Settings.CORS_ORIGINS`, defaulting to `http://127.0.0.1:5173,http://localhost:5173`.
- Database: `backend/app/database.py` uses `Settings.DATABASE_URL`, defaulting to PostgreSQL at `localhost:5432/banking_db`.
- Redis: `backend/app/redis_client.py`, `backend/app/services/otp_service.py`, and Celery use Redis URLs from settings.
- Email: `backend/app/services/email_service.py` uses SMTP settings for welcome and OTP email templates. If SMTP is missing during local development, the OTP is printed to the backend console.
- Celery: `backend/app/celery_worker.py` creates a Celery app with Redis broker and result backend.
- Nginx: `backend/nginx/nginx.conf` proxies traffic to `127.0.0.1:8000`.

## Render Backend Hosting

The repository now includes `render.yaml` at the project root. It defines:

- A Render Python web service named `under-seas-bank-api`.
- `rootDir: backend`, so Render builds only the backend folder.
- Build command: `pip install -r requirements.txt`.
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
- Health check path: `/health`.
- A managed Render PostgreSQL database named `under-seas-bank-db`.
- `DATABASE_URL` wired from the Render database connection string.

Render requires web services to bind to `0.0.0.0` and the platform-provided `$PORT`. The Dockerfile was also updated to respect `${PORT:-8000}` so it works locally and on platforms that inject a port.

Required Render environment variables:

- `DATABASE_URL`: Supplied by `render.yaml` from the Render database.
- `SECRET_KEY`: Generated by Render through `render.yaml`.
- `FIELD_ENCRYPTION_KEY`: Must be set manually to a valid Fernet key.
- `CORS_ORIGINS`: Must include the deployed frontend URL.

Generate `FIELD_ENCRYPTION_KEY` with:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Example hosted backend URL:

```text
https://under-seas-bank-api.onrender.com
```

## Frontend Hosting Recommendation

Recommended frontend host: Vercel.

Why Vercel:

- It works very smoothly with Vite React apps.
- It auto-detects build settings for many React/Vite projects.
- It gives fast static hosting and simple environment variable management.
- It is a clean match for a static frontend talking to a separate Render API.

Good alternatives:

- Netlify: also excellent for Vite static sites.
- Render Static Site: keeps frontend and backend on one platform.

Frontend production settings:

- Root directory: `frontend`.
- Build command: `npm run build`.
- Publish/output directory: `dist`.
- Environment variable: `VITE_API_BASE_URL=https://under-seas-bank-api.onrender.com`.

Backend CORS setting after frontend deploy:

```text
CORS_ORIGINS=https://your-frontend-domain.vercel.app,http://localhost:5173,http://127.0.0.1:5173
```

After updating `CORS_ORIGINS` on Render, redeploy or restart the backend service.

## Backend API Routers

- `/auth`: Register, login, profile, email status, phone OTP, email OTP, and verification endpoints.
- `/accounts`: Create account, list current user's accounts, statement, passbook.
- `/transactions`: Deposit, withdraw, transfer, transaction history.
- `/loans`: Apply for a loan, list current user's loans, pay EMI.
- `/fd`: Create fixed deposit, list current user's fixed deposits, close fixed deposit.
- `/credit-card`: Apply for card, list cards, purchase, pay bill.
- `/beneficiaries`: Add beneficiary, list current user's beneficiaries.
- `/analytics`: Expense category summary for charts.
- `/` and `/health`: Health checks.

## Frontend Architecture

The frontend is a React SPA:

1. `main.jsx` mounts React into the DOM.
2. `App.jsx` defines browser routes with `react-router-dom`.
3. `Login.jsx` handles registration, login, and required email OTP verification UI.
4. Authenticated pages use `MainLayout`.
5. Each page calls API helper functions from `services/api.js`.
6. API helpers attach the bearer token from `localStorage` for authenticated requests.
7. Chart components use Recharts for expense visualization.
8. CSS files define the application styling.

## Frontend Routes

- `/`: Login and registration.
- `/dashboard`: Account summary, loans, fixed deposits, analytics preview, transaction table.
- `/accounts`: Account creation and account list.
- `/transfer`: Deposit, withdraw, and transfer workflows.
- `/transactions`: Transaction history.
- `/loans`: Loan application and loan list.
- `/fd`: Fixed deposit workflow.
- `/credit-card`: Credit card application and card list.
- `/analytics`: Expense analytics chart.

## Data Model

- `User`: Name, email, phone, MPIN hash, failed login attempts, lock state, verification flags, creation time.
- `Account`: Encrypted account number, account number lookup hash, account type, balance, linked user.
- `Transaction`: Source account, destination account, amount, transaction type, timestamp.
- `Loan`: User, account, amount, interest, tenure, EMI, remaining balance, status, timestamp.
- `FixedDeposit`: User, account, principal, interest, duration, maturity amount, status, timestamp.
- `CreditCard`: User, account, encrypted card number, card number lookup hash, credit limit, used credit, available credit, status, timestamp.
- `Beneficiary`: User, encrypted beneficiary account number, IFSC, name.
- `Notification`: User, message, status, timestamp.

## Request Flow

1. The user interacts with a React page.
2. The page calls a function in `frontend/src/services/api.js`.
3. The helper sends JSON to the FastAPI backend.
4. Protected helpers include `Authorization: Bearer <token>`.
5. FastAPI route dependencies create a database session and resolve the current user.
6. The route validates ownership where needed.
7. The route calls the service layer.
8. The service performs database queries, calculations, and commits.
9. FastAPI serializes the response to JSON.
10. The frontend updates page state and renders the result.

## Authentication Flow

1. Register sends name, email, phone number, and MPIN.
2. Backend checks for duplicate email or phone number.
3. MPIN is hashed with Passlib bcrypt.
4. User row is saved.
5. Welcome email is attempted asynchronously.
6. Email OTP is generated, stored with expiry, and sent through the OTP email template.
7. JWT access token is created with `user_id`.
8. The frontend moves the new user to required email OTP verification.
9. Successful OTP verification marks `is_email_verified` as true.
10. Login finds the user by phone number and verifies MPIN.
11. If the user is still email-unverified, backend sends a new email OTP and frontend returns to the required verification step.
12. Failed attempts increment and lock the account after five failures.
13. Successful verified login resets failed attempts and returns a bearer token.
14. Protected endpoints decode the JWT and load the user from the database.

## Cython Check

Cython is a tool that compiles Python-like code into C extension modules, often using `.pyx` or `.pxd` files and build configuration such as `Extension(...)` or `cythonize(...)`.

This project's own backend source is plain Python. I found no project-owned `.pyx`, `.pxd`, `Cython`, `cythonize`, `Extension(...)`, `pybind`, `cffi`, `.c`, `.cpp`, `.so`, or `.pyd` files in `backend/app`.

The compiled-looking files in `backend/venv` belong to installed third-party dependencies. They are not backend application source and should not be treated as project code. To keep the backend strictly Python and OOP-style Python, keep project source in `.py` files and avoid adding Cython build files or compiled extension modules to `backend/app`.

## Connection Check Summary

- Frontend API base URL points to the backend at `http://127.0.0.1:8000`.
- Frontend API base URL can now be overridden with `VITE_API_BASE_URL` for hosted deployments.
- Backend CORS defaults allow Vite dev origins on port `5173`.
- Hosted frontend domains must be added to backend `CORS_ORIGINS`.
- Frontend API endpoints match backend route paths for auth, accounts, transactions, loans, fixed deposits, credit cards, beneficiaries, and analytics.
- Backend database connection is centralized in `database.py`.
- Redis is optional for OTP because OTP service falls back to memory if Redis is unavailable.
- Celery is configured but email service currently also supports background threads.
- Nginx is configured as a proxy to the FastAPI app.

## Review Notes

- Sensitive `.env` files and `backend/venv` should normally not be committed to GitHub.
- Some banking operations use floats in service signatures even though schemas use `Decimal`; money logic should consistently use `Decimal`.
- Deposits are allowed into any account owned by the current user. For a real banking system this would need stronger controls.
- Loan EMI payments reduce loan balance but do not debit a bank account.
- Fixed deposit creation does not debit the source account and closing an FD does not credit maturity amount back to the account.
- Credit card purchase and bill payment update credit card balances but do not create transactions or debit linked bank accounts.
- Phone OTP is printed to the backend console. That is acceptable for a demo, but not production.
