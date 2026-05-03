# System Architecture

The AI Code Review Agent follows a **Modular Agentic Workflow**. Instead of sending a raw diff directly to an LLM, the system decomposes the review process into specialized stages.

## 🏗️ High-Level Component Diagram

```mermaid
graph TD
    A[GitHub Webhook] -->|PR Event| B[Express Server]
    B -->|Payload| C[Dispatcher]
    C -->|Metadata| D[Review Orchestrator]
    
    subgraph Agents
        D -->|Parallel Execution| E[Diff Agent]
        D -->|Parallel Execution| F[Context Agent]
        D -->|Parallel Execution| G[Metadata Agent]
    end
    
    E --> H[Decision Maker]
    F --> H
    G --> H
    
    H -->|Meaningful?| I{Filter Gate}
    I -->|No| J[Post Skip Comment]
    I -->|Yes| K[Gemini Engine]
    
    K -->|AI Analysis| L[Post Professional Review]
```

## 🔄 Core Workflow

### 1. Ingestion Layer (`src/api/server.ts` & `src/events/dispatcher.ts`)
- Listens for `pull_request` events (`opened`, `synchronize`).
- Validates the payload and extracts core identifiers like PR Number, Repository Name, and commit SHAs.

### 2. Orchestration Layer (`src/orchestrator/ReviewOrchestrator.ts`)
- Manages the lifecycle of a single review.
- Uses `Promise.all` to run specialized agents concurrently to minimize latency.

### 3. Intelligence Layer (`src/engine/GeminiEngine.ts`)
- Uses the aggregated data from all agents to build a high-context prompt.
- Executes the `gemini-2.5-flash` model to generate the final code review.

### 4. Output Layer (`src/api/github.ts`)
- Communicates back to GitHub via the REST API to post comments.
