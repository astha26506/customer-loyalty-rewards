# System Architecture

## Overview
The Customer Loyalty Rewards System is a client-side web application split into presentation (`index.html`), styling (`style.css`), and domain/state logic (`app.js`), persisting data in browser `localStorage`.

## Architecture Diagram
```text
+-------------------------------------------------------+
|                   Browser UI (DOM)                    |
|  [Customer Claim Tab]           [Owner Monitor Tab]   |
|   - Claim Form + Lookup          - Metrics & Code Gen |
|                                  - Fraud Audit Table  |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|              Application Logic (app.js)               |
|  - Code Format Check (/^BOX-[A-Z0-9]{4,10}$/)         |
|  - Duplicate & Fraud Strike Counter (Max: 3)          |
|  - Balance Lookup & Owner Dashboard Renderer          |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|          Local Persistence (localStorage)             |
|       Key: factory_loyalty_rewards_v1                 |
|  { codes, auditLogs, blockedAttempts, failedByActor } |
+-------------------------------------------------------+