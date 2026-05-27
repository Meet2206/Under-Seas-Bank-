# Project Imports

This document lists the imports used by the frontend and backend and why each group is needed.

## Backend Dependencies

These are Python package dependencies used by the backend. They do not change the project rule that backend application source must remain plain `.py` Python files.

- `fastapi`: Builds the API app, routers, dependency injection, HTTP errors, and security dependencies.
- `uvicorn`: Runs the FastAPI ASGI server.
- `sqlalchemy`: Defines ORM models, database engine, sessions, relationships, and queries.
- `psycopg2-binary`: PostgreSQL driver used by SQLAlchemy.
- `alembic`: Database migration tool, included for schema migration support.
- `pydantic`: Defines request and response validation models.
- `pydantic-settings`: Loads application settings from environment variables and `.env`.
- `email-validator`: Validates email fields used by Pydantic `EmailStr`.
- `python-jose`: Encodes and decodes JWT access tokens.
- `passlib` and `bcrypt`: Hash and verify MPIN values securely.
- `cryptography`: Encrypts sensitive fields through Fernet.
- `redis`: Connects to Redis for OTP storage, cache helpers, and rate limiting.
- `celery[redis]`: Runs background worker tasks with Redis as broker and result backend.
- `python-dotenv`: Supports local environment variable loading.
- `httpx`: HTTP client dependency, currently present for possible outbound service calls.

## Backend Standard Library Imports

- `contextlib.asynccontextmanager`: Defines FastAPI startup and shutdown lifespan.
- `functools.lru_cache`: Caches settings so configuration is created once.
- `typing.List` and `typing.Optional`: Type hints for settings and nullable return values.
- `decimal.Decimal`: Accurate decimal arithmetic for money, interest, EMI, and analytics values.
- `collections.defaultdict`: Groups transaction amounts by category without manual key initialization.
- `datetime.datetime`, `timedelta`, `timezone`: Creates JWT expiry timestamps.
- `hashlib` and `hmac`: Builds stable keyed lookup hashes for encrypted identifiers.
- `secrets`: Generates secure account numbers, card numbers, and OTP digits.
- `time`: Tracks OTP expiration timestamps.
- `threading`: Protects in-memory OTP store and sends emails without blocking requests.
- `logging`: Records OTP and email service warnings or status.
- `smtplib`: Sends email through SMTP.
- `email.mime.text.MIMEText`: Builds email text or HTML body parts.
- `email.mime.multipart.MIMEMultipart`: Builds multipart email messages.

## Backend Internal Imports

- `app.config.get_settings`: Shared access to environment-backed settings.
- `app.database.engine`: Database engine used during startup table creation.
- `app.database.Base`: Declarative base used by all ORM models.
- `app.database.get_db`: FastAPI dependency that provides one SQLAlchemy session per request.
- `app.routes.*.router`: Router objects registered in the FastAPI app.
- `app.middleware.auth_middleware.get_current_user`: Protects authenticated endpoints by decoding the bearer token and loading the user.
- `app.models.*`: ORM classes used by services and routes to read and write database rows.
- `app.schemas.*`: Pydantic request and response classes used by route handlers.
- `app.services.*`: Business logic functions called by routers.
- `app.utils.password_hash`: Hashes and verifies MPIN values.
- `app.utils.jwt_handler`: Creates and decodes JWTs.
- `app.utils.lookup_hash`: Creates searchable hashes for encrypted account and card numbers.
- `app.utils.encryption.EncryptedString`: SQLAlchemy type decorator for encrypted string columns.
- `app.utils.emi_calculator.calculate_emi`: Calculates loan EMI.
- `app.analytics.expense_analyzer.analyze_expenses`: Groups transactions for expense charts.
- `app.celery_worker.celery`: Celery app instance used by task modules.

## Backend File-by-File Imports

- `backend/app/main.py`: FastAPI, CORS middleware, lifespan helper, settings, database engine/base, and all route routers.
- `backend/app/config.py`: Pydantic settings, settings cache, list typing.
- `backend/app/database.py`: SQLAlchemy engine/session/base plus settings.
- `backend/app/celery_worker.py`: Celery plus settings for broker/backend URLs.
- `backend/app/redis_client.py`: Redis client, optional typing, settings.
- `backend/app/middleware/auth_middleware.py`: FastAPI dependencies/errors, bearer auth, JWT error handling, database session, user model, token decoder.
- `backend/app/models/*.py`: SQLAlchemy columns/types/foreign keys, timestamps, relationships, base model, and encrypted string type where sensitive identifiers are stored.
- `backend/app/schemas/*.py`: Pydantic base model, field validation, decimal values, literal account type values, email and constrained string types.
- `backend/app/routes/*.py`: APIRouter, dependency injection, database session, schemas, services, models for ownership checks, and current-user dependency.
- `backend/app/services/*.py`: HTTP exceptions, database session, models, utilities, SMTP/email template helpers, OTP helpers, and money calculation helpers.
- `backend/app/tasks/email_tasks.py`: Celery app and email service functions.
- `backend/app/analytics/*.py`: Decimal math and grouping helpers for analytics.
- `backend/app/utils/*.py`: Focused imports for hashing, encryption, JWT, EMI, and number generation.

## Frontend Dependencies

- `react`: Provides components, hooks such as `useState` and `useEffect`, and the runtime UI model.
- `react-dom`: Mounts the React app into the browser DOM.
- `react-router-dom`: Provides browser routing, route definitions, links, navigation, and current location.
- `recharts`: Renders pie charts and responsive chart containers for analytics.
- `vite`: Development server and production build tool.
- `@vitejs/plugin-react`: Vite plugin for React support.
- `eslint`, `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`: Linting and React development checks.
- `@types/react`, `@types/react-dom`: Type metadata for editor support.

## Frontend File-by-File Imports

- `frontend/src/main.jsx`: Imports React, ReactDOM, `App`, and global CSS so the application can mount and render.
- `frontend/src/App.jsx`: Imports router primitives and all page components for route registration.
- `frontend/src/layout/MainLayout.jsx`: Imports `Sidebar` and `Header` to create the shared authenticated layout.
- `frontend/src/components/Header.jsx`: Imports React hooks and `getMe` to display current user details.
- `frontend/src/components/Sidebar.jsx`: Imports `Link`, `useLocation`, and `useNavigate` for navigation UI and logout flow.
- `frontend/src/components/ExpenseChart.jsx`: Imports React hooks, Recharts pie components, and `getAnalytics` for dashboard chart data.
- `frontend/src/components/TransactionTable.jsx`: Imports React hooks and `getTransactions` to load account transaction history.
- `frontend/src/components/Card.jsx`: No imports. It is a small presentational component.
- `frontend/src/pages/Login.jsx`: Imports React hooks, navigation, auth and OTP API helpers, and auth styling.
- `frontend/src/pages/Dashboard.jsx`: Imports hooks, navigation, layout, chart, transaction table, and account/loan/FD/user API helpers.
- `frontend/src/pages/Accounts.jsx`: Imports hooks, layout, and account API helpers.
- `frontend/src/pages/Transfer.jsx`: Imports hooks, layout, and transfer/deposit/withdraw/account API helpers.
- `frontend/src/pages/Transactions.jsx`: Imports hooks, layout, and transaction/account API helpers.
- `frontend/src/pages/Loans.jsx`: Imports hooks, layout, and loan/account API helpers.
- `frontend/src/pages/FixedDeposit.jsx`: Imports hooks, layout, and fixed deposit/account API helpers.
- `frontend/src/pages/CreditCard.jsx`: Imports hooks, layout, and credit card/account API helpers.
- `frontend/src/pages/Analytics.jsx`: Imports hooks, layout, analytics API helper, and Recharts chart components.
- `frontend/src/services/api.js`: No module imports. It uses Vite's `import.meta.env.VITE_API_BASE_URL`, browser `fetch`, and `localStorage` directly.

## Deployment Configuration Files

- `render.yaml`: Render blueprint for the backend web service and PostgreSQL database.
- `backend/.env.example`: Local backend environment variable template.
- `frontend/.env.example`: Local frontend environment variable template with `VITE_API_BASE_URL`.
- `.gitignore`: Keeps local `.env`, virtual environment, node modules, and build output out of Git.

## Deployment Environment Variables

- `VITE_API_BASE_URL`: Frontend build-time API base URL. Set this on Vercel, Netlify, or Render Static Site to the Render backend URL.
- `CORS_ORIGINS`: Backend comma-separated list of allowed frontend origins. Set this on Render to the deployed frontend URL plus local dev URLs if needed.
- `FIELD_ENCRYPTION_KEY`: Backend Fernet key required by encrypted database fields.
- `DATABASE_URL`: Backend PostgreSQL connection string supplied by Render.
- `SECRET_KEY`: Backend JWT signing secret.

## Imports Not Present

No project-owned backend file imports Cython, `.pyx`, `.pxd`, `cythonize`, C extension builders, `pybind`, or `cffi`. No project-owned backend app file uses `.c`, `.cpp`, `.so`, or `.pyd` extension-module source/output files. The backend app source is plain Python.

## Backend Import Policy

- Backend app imports should come from Python modules and Python packages only.
- Do not add imports from Cython modules.
- Do not add imports that depend on project-owned compiled extension modules.
- Keep OOP backend structures in Python classes, such as ORM models, Pydantic schemas, custom SQLAlchemy types, settings, and future service classes.
- Keep third-party dependency internals inside the virtual environment out of project import documentation unless a project file imports the package directly.
