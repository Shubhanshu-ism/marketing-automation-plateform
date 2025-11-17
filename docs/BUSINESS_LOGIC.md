# **Business Logic & Architectural Decisions**

---

This document provides insight into the "why" behind the key technical and architectural decisions made during the development of this Marketing Automation Platform.

### **1. Core Technology Choices**

#### **Why NestJS for the Backend?**
- **Reasoning:** NestJS provides a highly structured, modular, and scalable framework out-of-the-box. Its architecture, heavily inspired by Angular, enforces a strong separation of concerns (Controllers, Services, Modules), which is critical for building maintainable, enterprise-grade applications.
- **Business Impact:** This structure reduces development time, simplifies onboarding for new developers, and makes the codebase easier to test and debug. The use of TypeScript ensures type safety, catching potential errors early in the development cycle.

#### **Why a pnpm Monorepo?**
- **Reasoning:** This project consists of multiple, related applications (a backend API and a frontend dashboard). A monorepo managed by `pnpm` allows us to manage all codebases in a single repository. `pnpm` is particularly efficient with disk space and installation speed due to its content-addressable store for node modules.
- **Business Impact:** Simplifies dependency management, promotes code sharing between the frontend and backend (e.g., for type definitions), and streamlines the CI/CD process, as a single pipeline can build and deploy all parts of the application.

#### **Why Next.js for the Frontend?**
- **Reasoning:** Next.js is a powerful React framework that offers a great developer experience and a rich feature set, including server-side rendering (SSR), static site generation (SSG), and a built-in routing system.
- **Business Impact:** This allows for the creation of a fast, SEO-friendly, and modern user interface. The ability to mix server-rendered and client-rendered components provides flexibility in optimizing for performance and user experience.

---

### **2. Architecture & Design Patterns**

#### **Why Asynchronous Job Processing with BullMQ?**
- **Reasoning:** Many marketing automation tasks (like sending thousands of emails or processing analytics) are slow and would block the server if performed synchronously. By using a message queue (BullMQ + Redis), the API can offload these long-running tasks to background workers. The API's only job is to accept the request and add a "job" to the queue.
- **Business Impact:**
    - **Scalability:** We can scale the number of workers independently of the API to handle higher job volumes.
    - **Reliability:** Queues provide built-in retry mechanisms. If a job fails, it can be automatically retried, ensuring that tasks are not lost.
    - **User Experience:** The API remains fast and responsive, providing an immediate response to the user even when the underlying task takes a long time to complete.

#### **Why n8n for Workflow Orchestration?**
- **Reasoning:** Business logic, especially for multi-step workflows, can become complex and change frequently. Hard-coding this logic directly into the NestJS application makes it rigid and difficult for non-developers to understand or modify. `n8n` is a dedicated, node-based workflow automation tool that allows these processes to be built visually.
- **Business Impact:**
    - **Agility:** Marketing or product teams can potentially modify workflows (e.g., "change the wait time from 1 day to 2 days") without requiring a full software development cycle.
    - **Separation of Concerns:** The core backend application is not bloated with complex, specific business rules. It remains focused on providing core capabilities (like sending a single message), while n8n orchestrates *how* and *when* those capabilities are used.
    - **Visibility:** n8n provides a clear, visual representation of complex workflows, making them easier to understand and troubleshoot.

#### **Why a Decoupled Frontend & Backend?**
- **Reasoning:** The frontend (Next.js) and backend (NestJS) are separate applications that communicate via a REST API.
- **Business Impact:** This separation allows for independent development, deployment, and scaling of the UI and the backend logic. It also enables the backend to serve other clients in the future (e.g., a mobile app or third-party integrations) without any changes.

---
