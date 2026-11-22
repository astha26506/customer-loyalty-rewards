# Customer Loyalty Rewards System

A web application built for a factory producing physical products sold in boxes to reward customer loyalty, prevent code reuse/fraud, and provide owner monitoring.

## Features
- **Purchase Proof & Point Claiming:** Customers enter their name, email/phone, unique box code (`BOX-XXXX`), and purchase confirmation to claim reward points.
- **Fraud & Reuse Prevention:** Enforces code format validation, blocks already-claimed codes, and flags repeated failed/reused attempts (`MAX_FAILED_ATTEMPTS = 3`).
- **Customer Balance Lookup:** Customers can check their total earned points and claimed box codes.
- **Owner Monitor Dashboard:** Displays total points issued, claimed code count, available box codes, blocked attempts, new box code creation, and a claim/fraud audit log.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Persistence:** Browser `localStorage` (`factory_loyalty_rewards_v1`)
- **Version Control:** Git & GitHub

## Setup & Run Instructions
1. Clone or download the repository:
   ```bash
   git clone [https://github.com/astha26506/customer-loyalty-rewards.git](https://github.com/astha26506/customer-loyalty-rewards.git)