# AI Collaboration & Debugging Log

This log records key AI interactions during development, including mistakes caught and how they were resolved.

## Key Interactions
1. **Initial App Structure & Fraud Logic:** Requested a single-page loyalty claim app with code format validation, reuse prevention, attempt limits, and an owner audit dashboard.
2. **Documentation & Architecture Planning:** Requested structured project docs (`README.md`, `ASSUMPTIONS.md`, `ARCHITECTURE.md`, `TEST_PLAN.md`, `.env.example`) to document assumptions, data flow, and test coverage.
3. **Git Workflow & File Save Checks:** Verified incremental commits and pushes to `main` on `customer-loyalty-rewards`.

## AI Mistakes Caught & Fixed
1. **Wrong Workspace Folder Context:** Early guidance pointed to an older project folder before switching to `customer-loyalty-rewards`.
   - **How caught:** Checked the VS Code Explorer/terminal path and switched to `customer-loyalty-rewards`.
   - **How fixed:** Opened `customer-loyalty-rewards`, trusted the workspace, and created all assignment files inside that repository.
2. **Unsaved File State Before Git Commands:** Assumed files were already saved when unsaved indicator dots were still present in editor tabs.
   - **How caught:** Checked the editor tab indicators before running Git commands.
   - **How fixed:** Saved all files (`Ctrl + S`) before staging, committing, and pushing to `origin main`.