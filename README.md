# FROST — Field Resource & Operations Support Tracker

**Integrated Polar Expedition Logistics & Asset Management System**  
Developed for: **Ministry of Earth Sciences (MoES)** & **National Centre for Polar and Ocean Research (NCPOR)**  
Theme: **Smart Automation (SIH)**

---

## 1. What is FROST?

FROST is a centralized digital command and logistics platform designed for extreme environment polar operations across Antarctica and the Arctic. It provides real-time oversight for expedition planning, cold-chain cargo tracking, automated inventory depletion warnings, personnel movement validation, asset lifecycle monitoring, and emergency response coordination.

---

## 2. Key Features

- **Mission Control**: Central operations console with real-time KPIs, active emergency banners, and station readiness indicators.
- **Live Polar Operations Map**: Polar stereographic interactive projection of Antarctica featuring Maitri, Bharati, Amundsen-Scott South Pole, Cape Town Logistics Hub, and expedition vessel MV Vasiliy Golovnin with flight paths and shipping routes.
- **Expedition Command**: Full lifecycle management of Antarctic research missions, personnel complements, asset allocations, and science directives.
- **Cargo Intelligence & Chain of Custody**: End-to-end cargo consignment tracking with digital QR manifests, multi-stage timeline, and transit delay advisories.
- **Smart Inventory & Depletion Prediction**: Automated rule-based depletion engine computing days remaining vs resupply windows (e.g. Maitri Arctic-50 Fuel deficit alert).
- **Personnel Movement Coordinator**: Inter-station travel manifest system with automated conflict detection (maintenance holds and katabatic shear warnings) and resolution workflows (Approve, Reassign, Reschedule, Cancel).
- **Emergency Command Center**: Real-time critical incident management (Incident #INC-204), situation reports (SITREP), live response timeline logs, and action dispatch.
- **Smart Operational Alerts**: Prioritized operational risk alerts with instant acknowledgment, resolution, and module jump links.
- **Operational Analytics & Executive Reports**: Interactive throughput charts, consumption curves, fleet readiness indices, and downloadable mission summaries.
- **FROST Polar AI Co-Pilot**: Autonomous floating operations assistant embedded across the platform that proactively suggests critical operational tasks (fuel mitigation, transport reassignments, emergency actions) and executes them in 1-click. Supports `gemini-3.5-flash`, `gemini-3.1-pro-preview`, and `gemini-3.1-flash-lite`.
- **Gemini Analytics & Reports Chatbot**: Multi-turn conversational research and report generation engine embedded within Analytics and Reports with real-time **Google Search Grounding** (`googleSearch` tool with web source citations) and model selection.

---

## 3. Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion
- **Icons**: Lucide React
- **Data Architecture**: Strongly typed in-memory and persistent LocalStorage state manager with live reset baseline capability

---

## 4. How to Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 5. Demo Scenario Credentials

- **Commander**: Dr. Ananya Rao
- **Role**: Expedition Operations Commander
- **Access Level**: Level-5 Polar Field Command (Default Session Active)
- **Primary Demonstration**:
  1. Click **ENTER FROST →** on the Landing Page.
  2. Mission Control displays 3 expeditions, 87 personnel, 24 cargo shipments, 7 stock alerts, 142 assets, 2 incidents.
  3. Inspect **Inventory** to view the Maitri Fuel Resupply Risk (11.4 days left vs 15-day resupply).
  4. Search **FR-AX-10482** in **Cargo Tracking** to view its timeline and QR passport.
  5. Inspect **Movements** to see the Twin Otter transport conflict and resolution buttons.
  6. Inspect **Emergency Center** to review Incident #INC-204 and log live timeline actions.
