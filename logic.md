# Project Logic and Algorithms

This document explains the main logic used in the project and why each approach was chosen.

## Application Startup Logic

`backend/app/main.py` uses a FastAPI lifespan function. On startup it calls `Base.metadata.create_all(bind=engine)` to create database tables from SQLAlchemy models.

Why this approach:

- It is simple for a student or demo project.
- It avoids requiring Alembic migrations before the first run.
- It keeps local setup fast.

Why not another approach:

- Production systems usually use Alembic migrations instead because migrations are safer for evolving schemas without data loss.

## Backend Language and OOP Logic

The backend logic is required to stay in Python only. The project should not use Cython or compiled project-owned extension modules for backend application behavior.

Current OOP logic in the backend:

- SQLAlchemy model classes represent database entities.
- Pydantic schema classes represent request and response contracts.
- `Settings` represents environment-backed configuration.
- `EncryptedString` represents reusable encrypted database column behavior.

Current functional logic in the backend:

- FastAPI route handlers are functions because FastAPI naturally maps functions to HTTP endpoints.
- Service functions currently hold business operations such as registration, transfers, loan payments, fixed deposits, credit card actions, OTP, and email.

Future OOP direction:

- Larger service areas can be refactored into Python service classes such as `AuthService`, `AccountService`, `TransactionService`, `LoanService`, `FixedDepositService`, and `CreditCardService`.
- Route handlers should stay thin and delegate business rules to Python services.
- Domain behavior should remain readable Python and should not move into Cython, C, C++, or compiled app modules.

Why this approach:

- Python OOP keeps the backend understandable for a banking project.
- Classes make domain concepts explicit.
- Avoiding Cython keeps setup simpler and keeps the source code inspectable.

## Deployment Logic

Backend deployment logic:

1. Render reads `render.yaml`.
2. Render selects the backend folder through `rootDir: backend`.
3. Render installs Python dependencies from `backend/requirements.txt`.
4. Render starts FastAPI with `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
5. Render checks `/health` to confirm the service is alive.
6. The backend reads database, CORS, JWT, encryption, and email settings from environment variables.

Why this approach:

- Render expects web services to bind to `0.0.0.0` and the injected `$PORT`.
- Keeping `rootDir: backend` fits the current monorepo layout.
- A managed PostgreSQL database avoids running a database inside the web service.
- Environment variables keep secrets out of code.

Frontend deployment logic:

1. Host the Vite React frontend as a static site.
2. Build with `npm run build`.
3. Serve the generated `dist` folder.
4. Set `VITE_API_BASE_URL` before building so the compiled frontend points to the Render backend.
5. Add the frontend URL to backend `CORS_ORIGINS`.

Why this approach:

- The frontend is static after build, so it does not need a Node server in production.
- Vite exposes only environment variables prefixed with `VITE_` to browser code.
- CORS must allow the hosted frontend origin before browsers will accept API responses.

## Settings Logic

`backend/app/config.py` uses a `Settings` class from `pydantic-settings`. `get_settings()` is wrapped with `lru_cache()`.

Why this approach:

- Environment variables stay centralized.
- Defaults are visible in one file.
- Caching avoids rebuilding settings on every import or request.

## Database Session Logic

`backend/app/database.py` creates a SQLAlchemy engine and `SessionLocal`. The `get_db()` generator yields one session and closes it after the request.

Why this approach:

- Every request gets an isolated database session.
- FastAPI dependency injection makes the session available to routes.
- The `finally` block prevents leaked sessions.

## Authentication Logic

Registration:

1. Check if email or phone already exists.
2. Hash MPIN.
3. Create the user.
4. Send welcome email in the background.
5. Generate and send a required email OTP.
6. Return JWT token plus email verification metadata.

Login:

1. Find user by phone number.
2. Reject missing user.
3. Reject locked user.
4. Verify MPIN hash.
5. Increment failed attempts on wrong MPIN.
6. Lock user after five failed attempts.
7. Reset failed attempts on success.
8. If email is not verified, send a fresh email OTP and return verification metadata.
9. Return JWT token for verified users.

Why this approach:

- Phone plus MPIN matches common banking app login behavior.
- Hashing protects MPIN values at rest.
- Failed-attempt lockout slows brute-force attempts.
- JWT makes frontend authentication stateless after login.
- Required email OTP ensures every newly registered user proves access to the email address before continuing from signup.
- Unverified returning users are sent back to email OTP verification instead of entering the dashboard.

Why not store plain MPIN:

- Plain MPIN storage would expose user credentials if the database leaked.

## JWT Logic

`create_access_token()` stores `user_id` and an expiry time in the token. `get_current_user()` decodes the bearer token and loads the user from the database.

Why this approach:

- The frontend only needs to store one token.
- Backend routes can identify the current user without storing server-side sessions.
- Loading the user from the database ensures the user still exists.

## OTP Logic

OTP generation uses `secrets.randbelow(10)` to build a numeric code. OTP storage tries Redis first and falls back to an in-memory dictionary with expiration timestamps.

Why this approach:

- `secrets` is better than normal random generation for security-sensitive codes.
- Redis works across processes when available.
- In-memory fallback keeps the demo usable without Redis.
- New-user registration automatically sends an email OTP.
- The frontend email verification step no longer has a skip button.
- If SMTP is not configured locally, the backend prints the email OTP to the console so development testing is still possible.

Why not only memory:

- In-memory OTPs disappear on restart and do not work reliably with multiple backend workers.

## Password Hashing Logic

`passlib.context.CryptContext` with bcrypt hashes MPINs and verifies login attempts.

Why this approach:

- Bcrypt is intentionally slow, which makes brute-force attacks harder.
- Passlib hides low-level hashing details behind a simple API.

## Field Encryption and Lookup Hash Logic

Sensitive account and card numbers use `EncryptedString`, a SQLAlchemy type decorator backed by Fernet encryption. A separate HMAC lookup hash is stored for fields that need uniqueness checks.

Why this approach:

- Encryption protects raw identifiers in the database.
- HMAC lookup hashes allow equality checks without decrypting every row.
- This separates secure storage from searchable metadata.

Why not only encryption:

- Encrypted values are not practical for exact database lookup when encryption is randomized.

Why not plain text:

- Banking identifiers should not be stored as normal readable strings.

## Account Number Logic

Account numbers are generated with ten secure random digits. The service loops until the generated account number hash is not found in the database.

Why this approach:

- It is simple and avoids predictable sequential account numbers.
- Collision checking protects uniqueness.

## Credit Card Number Logic

Credit card numbers are generated as 16 digits beginning with `4`. The service checks the card number lookup hash for collisions.

Why this approach:

- Prefix `4` resembles Visa-style card numbers for demo realism.
- Collision checking prevents duplicate card numbers.

## Transaction Logic

Deposit:

1. Validate amount is positive.
2. Load account.
3. Add amount to balance.
4. Create deposit transaction.
5. Commit.

Withdraw:

1. Validate amount is positive.
2. Load account.
3. Check sufficient balance.
4. Subtract amount.
5. Create withdrawal transaction.
6. Commit.

Transfer:

1. Validate amount is positive.
2. Prevent transferring to the same account.
3. Load source and destination accounts.
4. Check source balance.
5. Subtract from source.
6. Add to destination.
7. Create transfer transaction.
8. Commit both balance updates and transaction together.

Why this approach:

- The logic is understandable and maps directly to banking actions.
- A single database commit keeps transfer updates together.
- Ownership checks happen in route handlers before service execution.

## Statement and Passbook Logic

The account statement and passbook load all transactions involving an account. They iterate in order and calculate a running balance by adding deposits/incoming transfers and subtracting withdrawals/outgoing transfers.

Why this approach:

- It reconstructs account history from transaction records.
- It gives the frontend a ready-to-render balance after each transaction.

## Loan Logic

Loan application:

1. Verify selected account belongs to current user.
2. Calculate EMI.
3. Create loan with principal as remaining balance.

EMI payment:

1. Load loan owned by user.
2. Subtract payment amount from remaining balance.
3. Close the loan when remaining balance reaches zero.

Why this approach:

- Ownership check prevents applying against another user's account.
- EMI is calculated once and stored for display.
- Remaining balance tracks repayment progress.

## EMI Algorithm

The EMI utility uses:

`EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)`

Where:

- `P` is principal.
- `r` is monthly interest rate.
- `n` is number of months.

Why this approach:

- It is the standard fixed-rate installment formula.
- It produces predictable monthly payments.

## Fixed Deposit Logic

FD creation:

1. Verify selected account belongs to current user.
2. Calculate maturity amount using simple interest.
3. Create FD row.

FD close:

1. Load FD owned by current user.
2. Mark status as closed.

Maturity calculation:

`maturity = principal * (1 + rate / 100 * years)`

Why this approach:

- Simple interest is easier to explain and verify.
- It works well for a demo banking project.

Why not compound interest:

- Compound interest is more realistic for some products, but it adds frequency and rounding decisions that the current schema does not model.

## Credit Card Logic

Apply:

1. Verify selected account belongs to current user.
2. Generate unique encrypted card number and lookup hash.
3. Set credit limit and available credit.

Purchase:

1. Load card owned by user.
2. Check available credit.
3. Increase used credit.
4. Decrease available credit.

Payment:

1. Load card owned by user.
2. Reduce used credit.
3. Clamp used credit at zero.
4. Recalculate available credit.

Why this approach:

- The card ledger is simple and easy to render.
- Credit limit checks prevent overspending.
- Available credit is kept as a stored value for direct display.

## Beneficiary Logic

The beneficiary route stores beneficiary details linked to the current user. Beneficiary account numbers use the encrypted column type.

Why this approach:

- Beneficiaries are user-scoped.
- Encryption protects sensitive account information.

## Analytics Logic

The analytics route loads outgoing transactions for the current user's accounts and passes them into `analyze_expenses()`. The analyzer groups amounts by category and returns category totals for charts.

Why this approach:

- The frontend receives chart-ready data.
- Grouping on the backend keeps the UI simple.
- `defaultdict` avoids repetitive category initialization code.

## Frontend API Logic

`frontend/src/services/api.js` centralizes all HTTP calls. Public auth calls use `fetch` directly. Protected calls use `authFetch()`, which:

1. Reads token from `localStorage`.
2. Adds JSON headers.
3. Adds `Authorization: Bearer <token>`.
4. Parses JSON response.
5. Throws an error if the response is not OK.

Why this approach:

- Every page uses one shared API style.
- Auth headers are not repeated in every component.
- Errors can be handled consistently by pages.

## Frontend Routing Logic

`App.jsx` uses `BrowserRouter`, `Routes`, and `Route` to map URLs to page components.

Why this approach:

- It keeps navigation client-side.
- It matches the Vite React SPA model.
- Pages remain separated by banking feature.

## Frontend State Logic

Pages use `useState` for form data, loading state, selected account/card/loan IDs, and API results. They use `useEffect` to load initial data after the page renders.

Why this approach:

- It is the standard React pattern for local page state.
- The current project does not need a global state library yet.

Why not Redux or another store:

- The app data is page-scoped and fetched from the backend, so a global state library would add complexity without much benefit.

## Chart Logic

Analytics UI uses Recharts pie chart components. Backend category totals become chart slices.

Why this approach:

- Recharts integrates naturally with React state.
- Pie charts fit category spending breakdowns.

## Current Logic Gaps to Improve

- Refactor larger service modules into Python service classes if strict OOP structure is required in the next backend iteration.
- Use `Decimal` consistently in service function parameters and calculations for money.
- Debit the selected account when creating a fixed deposit.
- Credit maturity amount when closing a fixed deposit.
- Debit an account when paying a loan EMI.
- Create transaction records for loan payments, fixed deposits, credit card purchases, and credit card bill payments.
- Replace console phone OTP with a real SMS provider before production.
- Add rate limiting to OTP endpoints.
- Move table creation to Alembic migrations for production.
