# ️ CampusFix: Campus Facility Complaint and Service Request System

> **Course:** Information Systems Agile Project Management with DevOps (ISAPMD 20261) 
> **Lecturer:** Eka Parima Saragih, S.Kom., M.Kom. 
> **Case Study:** Path B — Case 4: Facility Complaint and Service Request System 
> **Development Lead:** Sheiren Arnelia 
> **Repository:** `sheirenarnelia / ispm-facility-complaint-system`

---

## 1. Background & Problem Statement

In current university campus facility operations, reporting broken or malfunctioning infrastructure (faulty air conditioning, broken projectors, plumbing leaks, damaged classroom furniture) is primarily handled through informal WhatsApp messages, paper logbooks, or verbal reports to security personnel.

### Key Pain Points:
1. **Reporters (Students / Faculty / Campus Staff):** Complete lack of progress visibility or automated status tracking once an incident is reported.
2. **Campus Facility Management Department:** Inability to systematically queue incoming reports, prioritize high-urgency maintenance requests, dispatch technicians effectively, and audit unresolved complaints.

### Proposed Digital Solution:
**CampusFix** is a centralized, responsive web platform providing transparent facility incident tracking with structured state transitions (*Submitted* ➔ *In Progress* ➔ *Resolved*), digital reporting forms with photographic evidence upload, a real-time administrative monitoring dashboard, and standardized REST APIs backed by continuous integration (CI) automation.

---

## ️ 2. Technology Stack

The system architecture is engineered to be lightweight, modular, and cloud-ready without unnecessary database overhead during early sprint increments:

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Frontend Client** | HTML5, Tailwind CSS (via CDN), Vanilla JavaScript | Rapid prototyping, zero compilation overhead, fully responsive across mobile and desktop. |
| **Backend Service** | Node.js + Express.js | Industry standard asynchronous runtime, robust middleware ecosystem, clean MVC REST API routing. |
| **File Storage** | Multer Multipart Stream Engine | Secure local and cloud multipart image upload handling with payload boundary protection. |
| **Data Layer** | Structured Relational JSON Store | Zero-setup local persistence with pre-seeded data, directly schema-compatible with PostgreSQL / Supabase. |
| **Automated Testing**| Node.js Native Test Runner (`node:test`, `node:assert`) | Zero external test dependencies, sub-second execution speed, deterministic CI test runs. |
| **DevOps & CI/CD** | GitHub Actions Pipeline | Automated multi-version matrix build and testing on `main` and `dev` branches. |

---

## 3. Sprint 1 Deliverables (Class Evaluation Milestone: 24 Nov 2026)

For the initial class evaluation milestone on Tuesday, 24 November 2026, the following Sprint 1 increment is fully implemented and operational:

- [x] **Facility Incident Reporting Form (Student Portal):**
 - Fields: Reporter Name, Email/Contact, Campus Building/Zone, Room Details, Category Dropdown, Urgency Priority, and Detailed Incident Description.
 - Photographic Evidence Upload with instant client-side image preview.
- [x] **Complaints Directory & Administrative Dashboard (Staff Portal):**
 - KPI Metric Cards (Total Complaints, Submitted, In Progress, Resolved).
 - Search and filter bar by Ticket ID, reporter name, location, and status.
 - Interactive ticket table with urgency badges and photographic thumbnails.
 - Technician detail modal with live status transition capabilities (*Submitted* ➔ *In Progress* ➔ *Resolved*) and work notes.
- [x] **Automated Ticket ID Generator:** Formats tickets deterministically as `FAC-2026-XXX`.
- [x] **Standardized REST API:** Exposes endpoints for health check, complaint submission, list querying, and status updates.
- [x] **Automated CI Workflow:** GitHub Actions multi-version matrix build testing verified with green checkmark status.

---

## 4. Local Development & Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.x, 20.x, or 22.x LTS)
- [Git](https://git-scm.com/) installed on your operating system

### Installation & Execution
1. **Clone the repository:**
  ```bash
  git clone https://github.com/sheirenarnelia/ispm-facility-complaint-system.git
  cd ispm-facility-complaint-system
  ```

2. **Install project dependencies:**
  ```bash
  npm install
  ```

3. **Execute automated unit tests (Verifies system integrity):**
  ```bash
  npm test
  ```

4. **Start the local server:**
  ```bash
  npm start
  ```
  *(For development mode with auto-reload, use: `npm run dev`)*

5. **Access the application in your browser:**
  Open `http://localhost:3000` in Google Chrome, Safari, or your preferred browser.

---

## 5. RESTful API Specification

| HTTP Method | Endpoint Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Uptime and availability health check (DevOps monitoring) |
| `GET` | `/api/complaints/stats/summary` | Retrieves aggregate metric counts across all ticket statuses |
| `GET` | `/api/complaints` | Queries complaints list (Supports query parameters: `?status=...&category=...&search=...`) |
| `GET` | `/api/complaints/:id` | Retrieves comprehensive incident details for a single Ticket ID |
| `POST` | `/api/complaints` | Submits a new facility complaint (Supports multipart/form-data with image attachment) |
| `PATCH` | `/api/complaints/:id/status` | Transitions ticket status (*Submitted*, *In Progress*, *Resolved*) and appends staff notes |

---

## 6. Git Branching Strategy & Team Collaboration Policy

To ensure high codebase quality, clean commit history, and adherence to Agile DevOps best practices:

```text
main  ------------------------------------------------------------> [Production / Live Deployment]
     \                           /
dev    ----------------------------------------------------> [Integration & CI Testing]
       \            /    \       /
feature    --[feature/sprint-1]---     --[feature/*]--
```

### Team Branching Rules:
1. **Direct commits to `main` are strictly forbidden!**
2. The `main` branch is reserved exclusively for stable, reviewed release increments.
3. All new feature work must branch off `dev`:
  ```bash
  git checkout dev
  git pull origin dev
  git checkout -b feature/your-feature-name
  ```
4. Once work is complete, push your branch and open a **Pull Request (PR)** targeting `dev`.
5. Every Pull Request must pass all automated GitHub Actions CI checks prior to review and merge.

---

## 7. ISAPMD Project Team Roster & Roles

| Team Role | Member Name | Primary Deliverables Ownership |
| :--- | :--- | :--- |
| **Development Lead** | **Sheiren Arnelia** | Architecture Helicopter View, Backend API, Working Prototype, Git & CI |
| **Product Owner / Business Analyst** | **James** | Business Process Document, Stakeholder Map, MoSCoW Backlog, Change Request |
| **Scrum Master / Project Coordinator** | **Pharezia Areta** | Project Charter, Trello Board, Sprint Ceremonies, Weekly Slide Decks |
| **QA / UAT Lead** | **Naw Ngone Thitsar** | Testing Scenarios Template, Defect Log, UAT Sign-Off, Postman API Testing |
| **DevOps / Release Coordinator** | **Khairunnisa Akifah** | CI Pipeline Evidence, Cloud Deployment (Vercel), Monitoring, User Manual |
