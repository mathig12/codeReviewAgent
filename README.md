# 🤖 AI Code Review Agent

An intelligent, local-first code review engine powered by Google Gemini. It automates Pull Request analysis using an agentic multi-stage architecture to provide professional, actionable feedback directly on GitHub.

## 🚀 Product Overview

The **AI Code Review Agent** acts as an automated "Senior Software Engineer" in your CI/CD pipeline. It listens for GitHub webhooks, analyzes incoming changes, and provides constructive feedback, catching bugs, security flaws, and performance bottlenecks before they hit production.

### Key Features
- **Agentic Orchestration**: Uses a multi-agent system (`DiffAgent`, `ContextAgent`, `MetadataAgent`) to gather a comprehensive understanding of every PR.
- **Trivial PR Filtering**: Intelligently ignores "meaningless" changes (like `.txt` updates or minor documentation tweaks) to reduce noise and save API tokens.
- **Professional Persona**: Provides direct, concise, and actionable code reviews without conversational fluff.
- **Per-Commit Reviews**: For existing PRs, the agent reviews only the *latest* push rather than re-scanning the entire history.
- **E2E Automation Suite**: Includes built-in scripts to simulate real-world PR scenarios (meaningful features vs. trivial changes) for seamless testing.

## 📖 Detailed Documentation
- [Architecture & Workflow](docs/ARCHITECTURE.md)
- [Agents & Intelligence](docs/AGENTS.md)
- [Testing & Automation](docs/TESTING.md)
- [Troubleshooting & Fixes](docs/TROUBLESHOOTING.md)

## 🛠️ How It Functions

1. **Webhook Listener**: An Express server receives `pull_request` events from GitHub via an ngrok tunnel.
2. **Dispatcher**: Validates the event and extracts the PR metadata (title, author, SHAs).
3. **Orchestrator**: Executes agents in parallel:
   - **DiffAgent**: Fetches the raw diff. Determines if the change is "meaningful".
   - **ContextAgent**: Identifies languages and frameworks.
   - **MetadataAgent**: Assesses PR intent and complexity.
4. **Decision Maker**: Aggregates agent findings. If the PR is trivial, it posts a "Skip" comment. If meaningful, it passes everything to the **GeminiEngine**.
5. **GeminiEngine**: Uses the `gemini-2.5-flash` model with a highly-tuned professional template to generate actionable code fixes.
6. **GitHub API**: The final report is posted as a comment on the Pull Request.

---

## 📈 Issues Faced & Solutions

| Issue | Challenge | Fix |
| :--- | :--- | :--- |
| **Quota Exceeded (429)** | The user's free tier key had a limit of 0 for `gemini-2.5-pro`. | Switched the engine to use `gemini-2.5-flash` which provides ample free-tier requests. |
| **Self-Deleting Scripts** | E2E scripts were disappearing after use because they weren't committed to the main branch before the script ran `git checkout`. | Restored and permanently committed the testing scripts to the `main` branch. Modified scripts to only add specific files instead of `git add .`. |
| **TypeScript Compilation Errors** | Strict null checks (`noUncheckedIndexedAccess`) caused crashes during diff parsing. | Implemented safer array indexing and non-null assertions in `DiffAgent.ts`. |
| **Redundant Reviews** | PR updates were triggering a full review of all previous commits. | Implemented "Per-Commit" diffing using the GitHub Compare API (`before...after`). |

---

## 🚦 Getting Started

### 1. Environment Setup
Create a `.env` file with:
```env
PORT=3000
GEMINI_API_KEY=your_key_here
GITHUB_PAT=your_classic_token_here
```

### 2. Run the Server
```bash
npm install
npm run dev
```

### 3. Expose to GitHub
In a new terminal:
```bash
ngrok http 3000
```
Add the ngrok URL to your GitHub repository webhooks for `Pull Request` events.

### 4. Run E2E Tests
- **Test Meaningful PR**: `npm run test:e2e` (Creates a random complex scenario like Auth or API fetching).
- **Test Trivial PR**: `npm run test:trivial` (Creates a meaningless `.txt` file to test the filter).
