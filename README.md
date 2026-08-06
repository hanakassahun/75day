 # 75day: The Protocol Tracker ⚡

A high-performance, habit-ledger built for tracking consistency across the definitive 75-day challenge. Unlike traditional trackers that punitively wipe all history on an oversight, this dashboard functions as a daily self-improvement ledger—offering a clean slate every morning while enforcing hard, read-only accountability for past achievements.

![Next.js](https://shields.io)
![Tailwind CSS](https://shields.io)
![Drizzle ORM](https://shields.io)
![Neon Database](https://shields.io)

---

## 🛠️ The Architecture

The system tracks **28 interactive daily targets** broken down across 7 foundational cognitive and lifestyle categories:

*   **Coding** – Keeping the streak hot with daily technical deep-focus and active Git commits.
*   **Fitness** – Two distinct training sessions paired with intensive daily mobility routines.
*   **Nutrition** – Strict dietary compliance, hydration benchmarks, and absolute elimination rules.
*   **Mind** – Non-fiction consumption, continuous concept study, and brain-dump journaling.
*   **Recovery** – Structured sleep tracking, wind-down boundaries, and intentional resting metrics.
*   **Finance** – Micro-habit compound tracking, continuous budget audits, and savings goals.
*   **Self-Care** – Skincare routines, mindfulness checkpoints, and milestone daily progress snapshots.

---

## ✨ Key Engineering Features

*   **Read-Only Past-Day Accountability:** Users can look back at their complete chronological history to read old reflections and trace growth, but past days are structurally locked (`readOnly` forms and checkboxes) to prevent revisionist tracking or retrospective cheating.
*   **Airtight Server-Side Safeguards:** Front-end parameters cannot be spoofed. The backend endpoints parse authenticated sessions directly and block mutations with explicit `403 Forbidden` status codes if any updates are attempted on locked chronological dates.
*   **GitHub-Style Consistency Matrix:** Dynamically maps task completion percentages to an adaptive gradient grid view, visualizing execution momentum across the entire timeline.
*   **Intelligent Calendar Rollover:** Automatically tracks local timezone transitions to reset the frontend user ledger state to a clean slate at midnight without requiring manual cache invalidations.
*   **Optimized Batch Mutations:** State interactions are bundled seamlessly to minimize database pipeline congestion against the serverless database layer.

---

## 🚀 Tech Stack

*   **Framework:** Next.js (App Router)
*   **Styling:** Tailwind CSS + shadcn/ui component architecture
*   **Database Client:** Drizzle ORM
*   **Database:** Neon (Serverless PostgreSQL Instance)

---
 
 
