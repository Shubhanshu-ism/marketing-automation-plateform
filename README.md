# **Marketing Automation & Campaign Orchestration Platform**

---

### **1. Project Overview**

This repository contains the source code for a **Marketing Automation Platform**, a system that allows businesses to automate customer engagement through scheduled campaigns, event-based triggers, and multi-step workflows.

The primary goal is to build a scalable, observable, and cloud-deployable system that:
- Accepts campaign creation and scheduling requests via a REST API.
- Processes user segmentation and sends campaign messages asynchronously using background workers.
- Integrates with **n8n** to orchestrate complex marketing workflows.
- Provides a simple web dashboard for managing users, campaigns, and automation flows.

---

### **2. Getting Started**

This guide will walk you through setting up the project for local development.

**Prerequisites:**
- **Node.js:** v20 or higher
- **pnpm:** A fast, disk space-efficient package manager.
- **Docker:** For running services like PostgreSQL and Redis in isolated containers.

**Installation Steps:**

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    cd your-repo-name
    ```

2.  **Install Dependencies:**
    This command installs dependencies for all applications and packages in the monorepo.
    ```bash
    pnpm install
    ```

3.  **Configure Environment Variables:**
    The project uses `.env` files for environment-specific variables.
    ```bash
    # Copy the root environment file
    cp .env.example .env

    # Copy the API-specific environment file
    cp apps/api/.env.example apps/api/.env
    ```
    Now, open both `.env` files and fill in the required values (e.g., database credentials, JWT secret).

4.  **Start Infrastructure Services:**
    This command starts the PostgreSQL and Redis containers using Docker Compose.
    ```bash
    docker-compose up -d
    ```

5.  **Run Database Migrations:**
    This command applies the latest database schema to your local PostgreSQL instance.
    ```bash
    pnpm --filter api exec prisma migrate dev
    ```

6.  **Run the Applications:**
    You'll need two separate terminal sessions to run the backend and frontend concurrently.
    ```bash
    # In terminal 1: Start the NestJS API
    pnpm --filter api start:dev

    # In terminal 2: Start the Next.js Dashboard
    pnpm --filter dashboard dev
    ```

    - The API will be available at `http://localhost:3001`.
    - The dashboard will be available at `http://localhost:3000`.

---

### **3. Project Structure**

This project is a **monorepo** managed by `pnpm` workspaces. This structure helps organize code and share configurations between different parts of the application.

- **`apps/api`**: The backend **NestJS** application.
  - `src/`: Contains all the source code for the API.
    - `auth/`: Authentication and JWT logic.
    - `users/`: User management.
    - `campaigns/`, `flows/`, `segments/`, `events/`: Core business logic modules.
    - `jobs/`: Background job processors (BullMQ workers).
    - `prisma/`: Prisma schema and generated client.
  - `prisma/migrations`: Database migration files.

- **`apps/dashboard`**: The frontend **Next.js** application.
  - `app/`: The main application router and pages.
  - `components/`: Reusable React components.
  - `lib/`: Utility functions and API client.
  - `context/`: React context for state management (e.g., Auth).

- **`packages/`**: Shared libraries and types between applications (e.g., DTOs).

- **`n8n-workflows/`**: Exported JSON files for the n8n automation workflows.

---

### **4. Project Roadmap & Tasks**

This project is broken down into the following phases and micro-tasks.

#### **Phase 0: Project Setup (Completed) ✅**
- [x] Initialize `pnpm` monorepo.
- [x] Set up NestJS application in `apps/api`.
- [x] Set up Docker Compose with PostgreSQL and Redis.
- [x] Define initial Prisma schema for core models.
- [x] Create modular folder structure in the API.
- [x] Implement a `/health` check endpoint with DB connection check.

---

#### **Phase 1: Core Backend - Authentication, Users & RBAC (Completed) ✅**
- **Objective:** Implement a secure way for users to register, log in, and access protected resources based on their roles.
- **Tasks:**
    - [x] **Auth Module (`apps/api/src/auth`)**
    - [x] **Users Module (`apps/api/src/users`)**
    - [x] **RBAC (Role-Based Access Control)**
    - [x] **Security Features** (Rate Limiting, Validation, CORS)

---

#### **Phase 2: Core Backend - Campaigns, Flows, Segments, Events & Async Jobs (Completed) ✅**
- **Objective:** Build the functionality to create campaigns, target audiences, track events, and process them asynchronously.
- **Tasks:**
    - [x] **Flows Module (`apps/api/src/flows`)**
    - [x] **Campaigns Module (`apps/api/src/campaigns`)**
    - [x] **Jobs Module & BullMQ Integration (`apps/api/src/jobs`)**
    - [x] **Segments Module (`apps/api/src/segments`)**
    - [x] **Events Module (`apps/api/src/events`)**
    - [x] **FailureLog Model**

---

#### **Phase 3: Frontend Dashboard - Initial Setup & Auth (Completed) ✅**
- **Objective:** Create the frontend application and allow users to log in.
- **Tasks:**
    - [x] **Project Initialization** (Next.js, shadcn/ui)
    - [x] **Authentication** (Login, Register, Protected Routes)

---

#### **Phase 4: Frontend Dashboard - Campaign & Flow Management (Completed) ✅**
- **Objective:** Allow authenticated users to view and create campaigns and flows.
- **Tasks:**
    - [x] **Flow Management**
        - [x] Create a page to list and create simple flows.
        - [x] Connect the UI to the backend `Flows` API.
    - [x] **Campaign Management**
        - [x] Create a page to list all campaigns.
        - [x] Create a form to create a new campaign and schedule it.

---

#### **Phase 5: n8n Integration for Advanced Workflows (Completed) ✅**
- **Objective:** Offload complex, multi-step processes to a dedicated workflow engine.
- **Tasks:**
    - [x] Add n8n to the `docker-compose.yml` file.
    - [x] **N8N Service Module (`apps/api/src/n8n`)**
    - [x] **Workflow 1: Job Failure Alert**
        - [x] `CampaignProcessor` calls n8n webhook on job failure.
        - [x] n8n workflow logs failure and sends mock notification.
        - [x] Workflow JSON exported to `n8n-workflows/job-failure-alert.json`.
    - [x] **Workflow 2: Daily Scheduled Campaigns**
        - [x] n8n workflow with Cron trigger fetches and starts scheduled campaigns.
        - [x] Workflow JSON exported to `n8n-workflows/scheduled-campaigns.json`.
    - [x] **Documentation**
        - [x] `n8n-workflows/README.md` with import/setup instructions.

---

#### **Phase 6: Advanced Features, Deployment & Observability (In Progress) 🚧**
- **Objective:** Prepare the application for a production-like environment.
- **Tasks:**
    - [ ] **Infrastructure-as-Code (IaC)**
        - [ ] Write Terraform scripts to provision AWS resources (e.g., ECS, RDS, ElastiCache).
    - [ ] **CI/CD**
        - [ ] Create a GitHub Actions workflow to automatically build, test, and deploy the API and dashboard.
    - [ ] **Observability**
        - [ ] Integrate OpenTelemetry for distributed tracing across the NestJS API and workers.
        - [ ] Implement structured logging with correlation IDs.
    - [ ] **Testing**
        - [ ] Write unit and integration tests for critical backend services.
        - [ ] Write load-testing scripts using k6 or Artillery.
    - [ ] **Documentation**
        - [ ] Create a `postmortem.md` with analysis and limitations.
        - [ ] Generate and add an architecture diagram to the README.