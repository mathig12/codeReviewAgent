# Agent Definitions

The system uses a "Multi-Agent" approach where each agent has a single, specific responsibility. This allows for better context gathering and makes the system easier to extend.

## 🔍 Diff Agent (`src/agents/DiffAgent.ts`)
**Responsibility**: Fetch and parse the source code changes.
- **Logic**: 
  - If the event is a `synchronize` (new push), it uses the GitHub Compare API to fetch the diff between `before` and `after` SHAs.
  - If the event is `opened`, it fetches the entire PR diff.
- **Meaningful Check**: It analyzes file extensions. If 100% of the changed files are non-code (e.g., `.txt`, `.md`, `.gitignore`), it flags the PR as "trivial".

## 🏗️ Context Agent (`src/agents/ContextAgent.ts`)
**Responsibility**: Identify the environment and stack.
- **Logic**: Scans filenames and metadata to identify active languages (TypeScript, JavaScript) and frameworks (Express, React).
- **Purpose**: Provides the LLM with the "big picture" so it doesn't suggest fixes that are incompatible with the project's tech stack.

## 🏷️ Metadata Agent (`src/agents/MetadataAgent.ts`)
**Responsibility**: Extract PR intent.
- **Logic**: Analyzes the PR title and description using keyword heuristics.
- **Goal**: Identifies if the PR is a `feature`, `bugfix`, `refactor`, or `documentation` update.
