# Automated Testing Suite

To ensure the agent remains reliable, the project includes two specialized E2E testing scripts.

## 🚀 Meaningful Change Test (`scripts/test-pr.ts`)
This script simulates a real developer workflow.
- **Command**: `npm run test:e2e`
- **What it does**:
  1. Creates a new unique git branch.
  2. Randomly selects one of 3 complex scenarios:
     - **Calculator**: Math bugs (division by zero).
     - **AuthService**: Security bugs (hardcoded secrets).
     - **APIClient**: Async bugs (missing try/catch).
  3. Commits and pushes the change.
  4. Opens a GitHub Pull Request.
- **Goal**: Verify that the AI Reviewer correctly identifies and provides fixes for realistic code bugs.

## 📄 Trivial Change Test (`scripts/test-trivial-pr.ts`)
This script verifies the "Meaningful Change" filter.
- **Command**: `npm run test:trivial`
- **What it does**:
  1. Creates a new unique git branch.
  2. Creates a meaningless `.txt` file.
  3. Commits and pushes the change.
  4. Opens a GitHub Pull Request.
- **Goal**: Verify that the agent **skips** the AI review and instead posts a polite "Skipping AI Review" comment to save tokens.
