# 🤖 AI Code Review Agent

An intelligent, local-first code review engine powered by Google Gemini. It automates Pull Request analysis using an agentic multi-stage architecture to provide professional, actionable feedback directly on GitHub.

---

## 🚀 Product Overview

The **AI Code Review Agent** acts as an automated "Senior Software Engineer" in your CI/CD pipeline. It listens for GitHub webhooks, analyzes incoming changes, and provides constructive feedback, catching bugs, security flaws, and performance bottlenecks before they hit production.

### Key Features
- **Agentic Orchestration**: Uses a multi-agent system (`DiffAgent`, `ContextAgent`, `MetadataAgent`) to gather a comprehensive understanding of every PR.
- **Trivial PR Filtering**: Intelligently ignores "meaningless" changes (like `.txt` updates or minor documentation tweaks) to reduce noise and save API tokens.
- **Professional Persona**: Provides direct, concise, and actionable code reviews without conversational fluff.
- **Per-Commit Reviews**: For existing PRs, the agent reviews only the *latest* push rather than re-scanning the entire history.
- **E2E Automation Suite**: Includes built-in scripts to simulate real-world PR scenarios (meaningful features vs. trivial changes).

---

## 🏗️ System Architecture

The agent follows a **Modular Agentic Workflow**. Instead of sending a raw diff directly to an LLM, the system decomposes the review process into specialized stages.

### 🔄 Core Workflow
1. **Ingestion Layer**: Express server receives GitHub webhooks via ngrok.
2. **Orchestration Layer**: Executes agents (`Diff`, `Context`, `Metadata`) in parallel to gather facts.
3. **Intelligence Layer**: Uses `gemini-2.5-flash` with a professional persona to generate actionable code fixes.
4. **Output Layer**: Posts the final report as a structured comment on the Pull Request.

### 🤖 Agent Definitions
- **🔍 Diff Agent**: Fetches and parses changes. Handles per-commit diffing and trivial filtering.
- **🏗️ Context Agent**: Identifies languages and frameworks to provide tech-stack-aware reviews.
- **🏷️ Metadata Agent**: Assesses PR intent (feature, bugfix, refactor) from titles and descriptions.

---

## 🚦 Getting Started

### 1. Environment Setup
Create a `.env` file:
```env
PORT=3000
GEMINI_API_KEY=your_key_here
GITHUB_PAT=your_classic_token_here
```

### 2. Installation & Execution
```bash
npm install
npm run dev
# In another terminal:
ngrok http 3000
```

### 3. Automated Testing
- **Meaningful PR**: `npm run test:e2e` (Randomly generates Auth, API, or Logic bugs).
- **Trivial PR**: `npm run test:trivial` (Tests the "meaningless change" filter).

---

## 📈 Troubleshooting & Fixes

| Issue | Cause | Fix |
| :--- | :--- | :--- |
| **Quota Exceeded (429)** | Using `gemini-2.5-pro` on free tier. | Switched to `gemini-2.5-flash`. |
| **Self-Deleting Scripts** | Running E2E without committing the scripts to `main`. | Committed scripts permanently to the repository. |
| **TS Compilation Errors** | Strict null checks during diff parsing. | Added safer indexing and checks in `DiffAgent.ts`. |

---
> ✨ *Built with passion for better code quality.*
