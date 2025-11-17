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

### **2. Architecture & Design**

The platform is designed using a modern, decoupled architecture to ensure scalability, maintainability, and separation of concerns.

- **Monorepo:** A `pnpm` workspace is used to manage the backend, frontend, and shared packages in a single repository.
- **Backend API (`apps/api`):** A **NestJS** application responsible for core business logic, data management, and authentication. It exposes a RESTful API for the frontend and external services.
- **Frontend Dashboard (`apps/dashboard`):** A **Next.js** application providing the user interface for interacting with the platform.
- **Database:** **PostgreSQL** serves as the primary relational database, managed by **Prisma ORM**.
- **Job Queue:** **Redis** and **BullMQ** are used to manage and process long-running, asynchronous tasks like sending emails or processing analytics, preventing API bottlenecks.
- **Workflow Orchestration:** **n8n** is used to model and execute complex, multi-step business processes that are separate from the core application logic (e.g., handling job failures, running scheduled reports).

![Architecture Diagram](https://i.imgur.com/example.png)  <!-- Placeholder for a real diagram -->

---

### **3. Getting Started**

**Prerequisites:**
- Node.js (v20+)
- pnpm
- Docker and Docker Compose

**Local Installation:**

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-name>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Copy the `.env.example` file to `.env` in the root and in `apps/api`, then fill in the required values.
    ```bash
    cp .env.example .env
    cp apps/api/.env.example apps/api/.env
    ```

4.  **Start the local development environment:**
    This command will start the PostgreSQL and Redis containers.
    ```bash
    docker-compose up -d
    ```

5.  **Run database migrations:**
    This will apply the Prisma schema to your local database.
    ```bash
    pnpm --filter api prisma migrate dev
    ```

6.  **Run the applications:**
    ```bash
    # Run the backend API (in one terminal)
    pnpm --filter api start:dev

    # Run the frontend dashboard (in another terminal)
    pnpm --filter dashboard dev
    ```

---

### **4. Project Roadmap & Tasks**

This project is broken down into the following phases and micro-tasks.

#### **Phase 0: Project Setup (Completed)**
- [x] Initialize `pnpm` monorepo.
- [x] Set up NestJS application in `apps/api`.
- [x] Set up Docker Compose with PostgreSQL and Redis.
- [x] Define initial Prisma schema for core models.
- [x] Create modular folder structure in the API.
- [x] Implement a `/health` check endpoint.

---

#### **Phase 1: Core Backend - Authentication, Users & RBAC (Completed) ✅**
- **Objective:** Implement a secure way for users to register, log in, and access protected resources based on their roles.
- **Tasks:**
    - [x] **Auth Module (`apps/api/src/auth`)**
        - [x] Create `AuthService` with password hashing (bcrypt) and JWT generation logic.
        - [x] Create `AuthController` with public endpoints:
            - [x] `POST /auth/register`: Create a new user.
            - [x] `POST /auth/login`: Validate credentials and return a JWT.
        - [x] Implement `JwtStrategy` to validate tokens on incoming requests.
        - [x] Implement `JwtAuthGuard` to protect routes.
    - [x] **Users Module (`apps/api/src/users`)**
        - [x] Implement `UsersController` with protected endpoints:
            - [x] `GET /users/me`: Return the profile of the currently authenticated user.
            - [x] `GET /users`: Admin-only endpoint to list all users.
    - [x] **RBAC (Role-Based Access Control)**
        - [x] Create a `Roles` decorator in `apps/api/src/common/decorators`.
        - [x] Create a `RolesGuard` to authorize users based on the `Role` enum.
        - [x] Apply `RolesGuard` to admin-only and marketer endpoints.
    - [x] **Security Features**
        - [x] Add rate limiting with `@nestjs/throttler` (100 requests/min).
        - [x] Enable global `ValidationPipe` with whitelist and transform.
        - [x] Configure CORS for dashboard.
        - [x] Update `.env.example` files.

---

#### **Phase 2: Core Backend - Campaigns, Flows, Segments, Events & Async Jobs (Completed) ✅**
- **Objective:** Build the functionality to create campaigns, target audiences, track events, and process them asynchronously.
- **Tasks:**
    - [x] **Flows Module (`apps/api/src/flows`)**
        - [x] Implement basic CRUD API for `Flow` entities.
    - [x] **Campaigns Module (`apps/api/src/campaigns`)**
        - [x] Implement CRUD API for `Campaign` entities.
        - [x] Create `CampaignsService` with logic to start a campaign.
    - [x] **Jobs Module & BullMQ Integration (`apps/api/src/jobs`)**
        - [x] Configure BullMQ to connect to Redis.
        - [x] Create a `campaign-jobs` queue.
        - [x] Modify `CampaignsService` so that `startCampaign` adds a job to the `campaign-jobs` queue for each user in the target audience.
        - [x] Create a `CampaignProcessor` (worker) to listen for and process jobs from the queue.
        - [x] The processor should simulate sending a message (e.g., `console.log`) and update the `CampaignJob` status in the database (`PROCESSING` -> `SENT` or `FAILED`).
    - [x] **Segments Module (`apps/api/src/segments`)**
        - [x] Add `Segment` model to Prisma schema with filters (JSON).
        - [x] Implement full CRUD API with RBAC (ADMIN/MARKETER can create/update).
        - [x] Link campaigns to segments via `segmentId` field.
    - [x] **Events Module (`apps/api/src/events`)**
        - [x] Add `Event` model to track user interactions (email_opened, link_clicked, etc.).
        - [x] Public `POST /events` endpoint for tracking.
        - [x] Protected `GET /events` and `GET /events/stats` endpoints for analytics.
    - [x] **FailureLog Model**
        - [x] Add `FailureLog` model to Prisma schema for job failure tracking.

---

#### **Phase 3: Frontend Dashboard - Initial Setup & Auth (Completed)**
- **Objective:** Create the frontend application and allow users to log in.
- **Tasks:**
    - [x] **Project Initialization**
        - [x] Set up a new **Next.js** application in `apps/dashboard`.
        - [x] Add a UI component library (e.g., Material UI, Chakra UI, or shadcn/ui).
        - [x] Configure basic project structure (components, lib, styles, etc.).
    - [x] **Authentication**
        - [x] Create an API client/service for making requests to the backend.
        - [x] Build the UI for the Login, Register, and Dashboard pages.
        - [x] Implement client-side state management to handle the user's auth state and JWT.
        - [x] Create protected routes that redirect unauthenticated users to the login page.

---

#### **Phase 4: Frontend Dashboard - Campaign & Flow Management**
- **Objective:** Allow authenticated users to view and create campaigns and flows.
- **Tasks:**
    - [ ] **Flow Management**
        - [ ] Create a page to list and create simple flows (form-based, not drag-and-drop yet).
        - [ ] Connect the UI to the backend `Flows` API.
    - [ ] **Campaign Management**
        - [ ] Create a page to list all campaigns.
        - [ ] Create a form to create a new campaign and schedule it.
        - [ ] Add a button to manually trigger the "start campaign" endpoint.
        - [ ] Display campaign status and job progress.

---

#### **Phase 5: n8n Integration for Advanced Workflows (In Progress) 🚧**
- **Objective:** Offload complex, multi-step processes to a dedicated workflow engine.
- **Approach:**
    - NestJS API calls n8n webhooks for async workflows (job failures, notifications)
    - n8n schedules trigger NestJS API endpoints (daily campaign execution)
    - n8n workflows interact with database via HTTP nodes calling the API
- **Tasks:**
    - [x] Add n8n to the `docker-compose.yml` file (port 5678).
    - [ ] **N8N Service Module (`apps/api/src/n8n`)**
        - [ ] Create `N8nService` with methods to trigger webhooks.
        - [ ] Add configuration for n8n webhook URLs in `.env`.
    - [ ] **Workflow 1: Job Failure Alert**
        - [ ] Create n8n workflow with webhook trigger (`/webhook/job-failure`).
        - [ ] Modify `CampaignProcessor` to call n8n webhook when job fails.
        - [ ] n8n workflow: Log failure to `FailureLog` table via API POST.
        - [ ] n8n workflow: Send mock notification (console log or webhook).
        - [ ] Export workflow JSON to `n8n-workflows/job-failure-alert.json`.
    - [ ] **Workflow 2: Daily Scheduled Campaigns**
        - [ ] Create n8n workflow with Cron trigger (daily at 8 AM).
        - [ ] Workflow calls `GET /campaigns?status=SCHEDULED` to fetch due campaigns.
        - [ ] Loop through campaigns and call `POST /campaigns/:id/start` for each.
        - [ ] Export workflow JSON to `n8n-workflows/scheduled-campaigns.json`.
    - [ ] **Webhook Endpoints in API**
        - [ ] Create webhook controller for n8n callbacks if needed.
    - [ ] **Documentation**
        - [ ] Add `n8n-workflows/README.md` with import/setup instructions.

---

#### **Phase 6: Advanced Features, Deployment & Observability**
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

---