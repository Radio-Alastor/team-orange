# Silver Guide Development Guide

This guide explains how to run the components of the Silver Guide application. You can choose to run the application using your local machine's native development tools (without Docker) or fully containerized using Docker Compose.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Native Development Setup (Without Docker)](#2-native-development-setup-without-docker)
   - [2.1 Database Setup](#21-database-setup)
   - [2.2 Backend (Spring Boot)](#22-backend-spring-boot)
   - [2.3 Chatbot AI (Python FastAPI)](#23-chatbot-ai-python-fastapi)
   - [2.4 Frontend (React Router / Vite)](#24-frontend-react-router--vite)
   - [2.5 Success! Accessing the Site](#25-success-accessing-the-site)
3. [Docker Compose Setup](#3-docker-compose-setup)
   - [3.1 Development Environment](#31-development-environment)
   - [3.2 Production Environment](#32-production-environment)

---

## 1. Prerequisites
Before you begin, ensure you have the following installed on your machine:
- **Java 21** (for the backend)
- **Node.js (v20+) & PNPM** (for the frontend)
- **Python 3.12+** (for the chatbot)
- **MySQL 8.0+** (Running locally on your default port `3306`)
- **Docker & Docker Compose** (Optional: Only if choosing the Docker deployment strategy)

---

## 2. Native Development Setup (Without Docker)

### 2.1 Database Setup
You will need a native MySQL server running on your machine.
1. Start your local MySQL server.
2. Log into your MySQL console and create the database and user that match your `.env` configuration:
   ```sql
   CREATE DATABASE silverguide;
   CREATE USER 'sguser'@'localhost' IDENTIFIED BY 'sgpassword';
   GRANT ALL PRIVILEGES ON silverguide.* TO 'sguser'@'localhost';
   FLUSH PRIVILEGES;
   ```
   *(Alternatively, you can just update `backend/src/main/resources/application.properties` or `backend/.env` to match your existing local root database credentials).*

### 2.2 Backend (Spring Boot)
The Spring Boot backend acts as the core API and needs to be hooked up to your local MySQL database and chatbot.
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Because you aren't using Docker, the backend's environment variables (`DB_HOST` and `CHAT_API_URL`) need to point to `localhost` rather than Docker internal hostnames. Run the backend by injecting the correct environment variables:

   **On macOS / Linux:**
   ```bash
   DB_HOST=localhost DB_PORT=3306 CHAT_API_URL=http://localhost:8001 ./mvnw spring-boot:run
   ```
   **On Windows (PowerShell):**
   ```powershell
   $env:DB_HOST="localhost"; $env:DB_PORT="3306"; $env:CHAT_API_URL="http://localhost:8001"; .\mvnw.cmd spring-boot:run
   ```

   *The backend should successfully connect to MySQL, run Flyway migrations, and start on `http://localhost:8080`.*

### 2.3 Chatbot AI (Python FastAPI)
The chatbot relies on Python and FastAPI.
1. Open a **new terminal tab** and navigate to the chatbot folder:
   ```bash
   cd chatbot
   ```
2. Create and activate a Virtual Environment:
   **On macOS / Linux:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```
   **On Windows:**
   ```cmd
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI Uvicorn server:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```
   *The Chatbot API is now running on `http://localhost:8001`.*

### 2.4 Frontend (React Router / Vite)
Normally, Docker Compose uses an `Nginx` container to proxy API requests to the backend. Running locally means we bypass Nginx, so we must tell the frontend where to find the backend directly using `VITE_API_URL`.

1. Open a **new terminal tab** and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install the necessary Node dependencies using PNPM:
   ```bash
   pnpm install
   ```
3. Run the Vite development server while telling it to target your local backend:
   
   **On macOS / Linux:**
   ```bash
   VITE_API_URL=http://localhost:8080 pnpm run dev
   ```
   **On Windows (PowerShell):**
   ```powershell
   $env:VITE_API_URL="http://localhost:8080"; pnpm run dev
   ```

   *The frontend is now running on `http://localhost:5174`.*

### 2.5 Success! Accessing the Site
Visit `http://localhost:5174` in your browser. 
- The React application will load.
- It will make API requests properly to `http://localhost:8080` (CORS is already configured properly in the backend to allow your localhost domains via the `.env` settings).
- The Backend will proxy AI chat questions over to `http://localhost:8001`.

---

## 3. Docker Compose Setup
If you prefer to run the application fully containerized (with the Nginx proxy, MySQL, Backend, Frontend, and Chatbot all wired together automatically natively), you can use Docker Compose. Make sure your `.env` and `chatbot/.env` files are correctly set up before starting.

### 3.1 Development Environment
The development environment exposes your local frontend folder directly to the container so you get real-time Hot Module Replacement (HMR) while editing code. It also gracefully sets the `Secure` flag on cookies to `false` so local HTTP testing works seamlessly.

To build and start the development environment:
```bash
docker compose -f docker-compose-dev.yml up --build -d
```
Access the app at: `http://localhost:5174`

To stop the environment:
```bash
docker compose -f docker-compose-dev.yml down
```

### 3.2 Production Environment
The production environment acts as the real-world simulation. It creates an optimized, static build for the frontend, heavily utilizes caching, and locks the security boundaries to expect running behind an active secure proxy (HTTPS), setting `SECURE_COOKIE` to `true`.

To build and start the production environment:
```bash
docker compose up --build -d
```
Access the app at: `http://localhost:5174` (or whatever external port your host is forwarding).

To stop the environment:
```bash
docker compose down
```
