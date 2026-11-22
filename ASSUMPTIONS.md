# Assumptions

Because the initial client brief left several implementation details open, the following assumptions were made and documented:

1. **Box Code Format:** Unique box codes follow the pattern `BOX-XXXX` (`/^BOX-[A-Z0-9]{4,10}$/`), converted to uppercase on input so minor casing differences do not cause accidental failures.
2. **Sample Seeded Codes:** Pre-seeded sample codes (`BOX-1001` = 50 pts, `BOX-1002` = 100 pts, `BOX-1003` = 75 pts) are included so evaluators can immediately test valid claims without manual setup first.
3. **Fraud & Rate-Limit Threshold:** Repeated invalid, unknown, or already-used code attempts are tracked per customer actor (`name|contact`). After 3 failed attempts (`MAX_FAILED_ATTEMPTS = 3`), further attempts from that profile are flagged as blocked in the owner audit log.
4. **Client-Side Persistence (`localStorage`):** Data is stored locally in the browser under `factory_loyalty_rewards_v1` for a self-contained prototype. A production deployment would move code validation, fraud counters, and audit logs to a backend database and server-side API.
5. **Owner Access in Prototype:** The **Owner Monitor** tab is accessible directly via top navigation for demo convenience; production systems should protect owner controls with authentication and role-based access.
6.