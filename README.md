# 🚀 Starter Kit: NestJS REST API

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230blue.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

A production-ready **RESTful API Starter Kit** built with **NestJS**.
This project is a modern, type-safe, featuring a dual-database architecture (**PostgreSQL** & **SQLite**), Serverless Vercel support, Docker support, and automated API testing scripts.

## ✨ Features

- 🏗 **Modular Architecture**: Built on NestJS modules for scalability.
- 💾 **Dual Database Support**: Switch between **PostgreSQL** (Production) and **SQLite** (Dev) instantly via `.env`.
- ☁️ **Serverless Ready**: Configured out-of-the-box for **Vercel** deployment.
- 🔐 **Authentication**: Full auth system (Login, Register, Refresh Tokens, Password Reset, Email Verification).
- 🛡 **Security**: Helmet, CORS, Rate Limiting, and DTO Validation (`class-validator`).
- 🐳 **Docker Ready**: Production-optimized `Dockerfile` with `entrypoint.sh` for reliable deployments.
- 📃 **API Documentation**: Auto-generated Swagger UI.
- 🐍 **Automated Testing**: Custom Python scripts to test endpoints without Postman.

---

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or v20 recommended)
- **npm** or **yarn**
- **Python 3.x** (For running API test scripts)
- **Docker** (Optional, for containerized deployment)

---

## 💻 Running Locally (Recommended for Development)

We recommend running the app locally first to understand how it works.

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd starter-kit-restapi-nest
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Duplicate the example environment file:
```bash
cp .env.example .env
```
> **Note:** By default, `.env` is configured to use **SQLite**. No extra database setup is required! The `database.sqlite` file will be created automatically.

### 4. Run the Application
```bash
# Development mode (Watch mode)
npm run start:dev
```

The server will start at: `http://localhost:3000/v1`
Swagger Documentation: `http://localhost:3000/v1/docs`

---

## ☁️ Deployment: Serverless (Vercel + Neon)

This project is pre-configured for Vercel using `api/index.ts` as the serverless entry point. We recommend using **Neon** (Serverless PostgreSQL) for the database.

### 1. Database Setup (Neon)
1.  Create a project at [Neon.tech](https://neon.tech).
2.  Copy your **Connection String** (e.g., `postgresql://user:pass@ep-xyz.aws.neon.tech/db_name?sslmode=require`).

### 2. Vercel Setup
1.  Push this code to your **GitHub** repository.
2.  Go to [Vercel Dashboard](https://vercel.com) -> **Add New** -> **Project**.
3.  Import your repository.

### 3. Environment Variables
In the Vercel Project Settings, add the following variables:

| Variable | Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production mode. |
| `DB_TYPE` | `postgres` | Sets DB driver. |
| `DATABASE_URL` | `postgresql://...` | **Your Neon Connection String**. |
| `DB_SYNC` | `true` | **Crucial:** Forces TypeORM to create tables automatically on deploy. |
| `JWT_SECRET` | `(your_secret)` | Random long string for security. |
| `JWT_ACCESS_EXPIRATION_MINUTES` | `60` | Token lifetime. |

> **Note:** When using `DATABASE_URL`, you do **not** need to set `DB_HOST`, `DB_USERNAME`, etc. separately.

### 4. Verify Deployment
Once deployed, verify by visiting the Swagger Docs:
`https://<your-project>.vercel.app/v1/docs`

---

## 🐳 Running with Docker (VPS / Dedicated Server)

If you prefer using Docker on a VPS instead of Vercel, follow these steps.

### 1. Configure Docker Environment
Create a specific environment file for Docker:
```bash
# Create .env.docker
cp .env.example .env.docker
```

**⚠️ Important:** Open `.env.docker` and ensure these values are set for Docker networking:

```env
PORT=5005
NODE_ENV=production

# Database Config
DB_TYPE=postgres
DB_HOST=restapi-nest-db   <-- Must match the container name below
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secure_password
DB_NAME=nest_db

# Auto-create tables (Migration)
DB_SYNC=true
```

### 2. Create Network & Volumes
We need a network for communication and volumes to persist data even if containers are destroyed.

```bash
# Create Network
docker network create restapi_nest_network

# Create Volumes
docker volume create restapi_nest_db_volume
docker volume create restapi_nest_media_volume
```

### 3. Build the App Image
```bash
docker build -t restapi-nest-app .
```

### 4. Run PostgreSQL Container
Run the database attached to the network and volume.

```bash
docker run -d \
  --name restapi-nest-db \
  --network restapi_nest_network \
  -v restapi_nest_db_volume:/var/lib/postgresql/data \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=nest_db \
  postgres:15-alpine
```

### 5. Run NestJS App Container
Run the app, loading the `.env.docker` file.

```bash
docker run -d -p 5005:5005 \
  --env-file .env.docker \
  --network restapi_nest_network \
  -v restapi_nest_media_volume:/usr/src/app/uploads \
  --name restapi-nest-container \
  restapi-nest-app
```

Your app is now running at: `http://localhost:5005/v1/docs`

---

## 📦 Docker Management Cheatsheet

Here are the commands to manage your containers manually.

### View Logs
See what's happening inside the app (migrations, errors, requests).
```bash
docker logs -f restapi-nest-container
```

### Stop Container
 Safely stops the application.
```bash
docker stop restapi-nest-container
```

### Start Container
Restarts a stopped container.
```bash
docker start restapi-nest-container
```

### Remove Container
Deletes the container instance (Data remains safe in volumes).
```bash
docker rm restapi-nest-container
```

### Manage Volumes
**List all volumes:**
```bash
docker volume ls
```

**❌ Delete Volume (DANGER):**
> **WARNING:** This command deletes your database data PERMANENTLY.
```bash
docker volume rm restapi_nest_db_volume
```

---

## 🧪 API Testing (Python Scripts)

Forget Postman! This project comes with a suite of **Python scripts** to test every endpoint instantly. It handles token storage automatically using `secrets.json`.

### Setup
Ensure you have `utils.py` and the `*_*.py` script files in your directory.
**Note:** If running on Vercel or Docker, update `BASE_URL` in `utils.py` to match your target URL.

### How to Run
Simply run the script file using python. No arguments needed.

**1. Register (Start here)**
Creates a user and saves the Access/Refresh tokens.
```bash
python A1.auth_register.py
```

**2. Other Actions**
Once registered, you can run any other script. The system automatically reads the valid token from `secrets.json`.
```bash
python A2.auth_login.py
python B2.user_get_all.py
python B4.user_update.py
python A3.auth_refresh.py
```

---

## 📂 Project Structure

```text
src/
├── common/             # Shared resources (Guards, Decorators, Filters)
├── config/             # Config for DB, App, Swagger, Validation
├── database/           # Migrations & Data Source
├── modules/            # Feature Modules
│   ├── auth/           # Authentication Logic (JWT, Strategies)
│   ├── users/          # User Management (CRUD, Entity)
│   └── mail/           # Email Service (Nodemailer)
├── app.module.ts       # Root Module
└── main.ts             # Local/Docker Entry Point
api/
└── index.ts            # Vercel Serverless Entry Point
vercel.json             # Vercel Configuration
```

## 📄 License

[MIT](LICENSE)