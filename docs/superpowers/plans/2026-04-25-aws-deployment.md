# AWS Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deploy the full-stack application (Next.js frontend, FastAPI backend, and PostgreSQL database) to AWS.

**Architecture:** Use AWS RDS for the persistent database, AWS App Runner for the containerized FastAPI backend, and AWS Amplify for the Next.js frontend. Implement a CI/CD pipeline using GitHub Actions.

**Tech Stack:** Docker, AWS RDS (Postgres), AWS App Runner, AWS Amplify, GitHub Actions.

---

## File Structure

- Create: `backend/Dockerfile` - Container definition for the API.
- Create: `frontend/Dockerfile` - Container definition for the frontend (if not using Amplify build).
- Create: `.github/workflows/deploy-backend.yml` - CI/CD for the API.
- Create: `.github/workflows/deploy-frontend.yml` - CI/CD for the frontend.
- Create: `docker-compose.prod.yml` - For production-like local testing.

---

## Tasks

### Task 1: Containerization

**Files:**

- Create: `backend/Dockerfile`

- [ ] **Step 1: Create Backend Dockerfile**
  Create `backend/Dockerfile`:

  ```dockerfile
  FROM python:3.11-slim
  WORKDIR /app
  COPY requirements.txt .
  RUN pip install --no-cache-dir -r requirements.txt
  COPY . .
  EXPOSE 8000
  CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
  ```

- [ ] **Step 2: Verify Docker Build**
  Run: `cd backend && docker build -t orders-api .`
  Expected: Image built successfully.

- [ ] **Step 3: Commit**
  Run: `git add backend/Dockerfile`
  Run: `git commit -m "ci: add dockerfile for backend"`

### Task 2: Database Provisioning (RDS)

**Files:**

- None (AWS Console/CLI)

- [ ] **Step 1: Create RDS Instance**
  1. Navigate to RDS Console -> Create Database.
  2. Select PostgreSQL.
  3. Choose "Free Tier" template.
  4. Set Master Username and Password.
  5. Set Public Access to "No" (for security, accessible by App Runner).

- [ ] **Step 2: Note Connection String**
  Expected: `postgresql://user:password@endpoint:5432/dbname`

### Task 3: Backend Deployment (App Runner)

**Files:**

- Create: `.github/workflows/deploy-backend.yml`

- [ ] **Step 1: Setup GitHub Action for Backend**
  Create `.github/workflows/deploy-backend.yml` to push image to ECR and trigger App Runner deployment.
  (Note: Requires AWS IAM credentials as secrets).

- [ ] **Step 2: Deploy to App Runner**
  1. Create Service in App Runner.
  2. Source: Container Registry (ECR).
  3. Environment Variables: `DATABASE_URL` (from RDS).

- [ ] **Step 3: Verify Health Check**
  Expected: App Runner service status "Running" and URL returning 200.

### Task 4: Frontend Deployment (Amplify)

**Files:**

- Create: `.github/workflows/deploy-frontend.yml`

- [ ] **Step 1: Connect Amplify to GitHub**
  1. Amplify Console -> New App -> Host Web App.
  2. Connect GitHub repository.
  3. Select branch `main`.

- [ ] **Step 2: Configure Environment Variables**
  Set `NEXT_PUBLIC_API_URL` to the App Runner service URL.

- [ ] **Step 3: Deploy**
  Expected: Amplify builds the app and provides a `.amplifyapp.com` URL.

### Task 5: Final Integration & Testing

- [ ] **Step 1: Test End-to-End Flow**
  1. Open Frontend URL.
  2. Create an order.
  3. Verify order appears in the list.
  4. Verify data persists after backend restart.

- [ ] **Step 2: Commit Documentation**
  Update `README.md` with deployment status and URLs.
  Run: `git add README.md`
  Run: `git commit -m "docs: update readme with deployment info"`

---
