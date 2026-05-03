import { AgentContext } from '../agents/BaseAgent';
import { DiffAgent } from '../agents/DiffAgent';
import { ContextAgent } from '../agents/ContextAgent';
import { MetadataAgent } from '../agents/MetadataAgent';
import { DecisionMaker } from '../decision/DecisionMaker';

export class ReviewOrchestrator {
  async runReview(prMetadata: AgentContext['prMetadata']): Promise<void> {
    console.log(`[Orchestrator] Starting review process for PR #${prMetadata.prNumber}...`);
    
    const context: AgentContext = { prMetadata };

    // Initialize Agents
    const diffAgent = new DiffAgent(context);
    const contextAgent = new ContextAgent(context);
    const metadataAgent = new MetadataAgent(context);

    // Run Agents in Parallel
    console.log('[Orchestrator] Executing agents in parallel...');
    
    try {
      const [diffResult, contextResult, metadataResult] = await Promise.all([
        diffAgent.run(),
        contextAgent.run(),
        metadataAgent.run()
      ]);

      console.log('[Orchestrator] Agents completed successfully. Proceeding to Decision Maker...');

      // Pass results to the Decision Maker
      const decisionMaker = new DecisionMaker();
      await decisionMaker.makeDecision(diffResult, contextResult, metadataResult, prMetadata);

      console.log(`[Orchestrator] Review process for PR #${prMetadata.prNumber} completed.`);
    } catch (error) {
      console.error(`[Orchestrator] Review process failed for PR #${prMetadata.prNumber}:`, error);
    }
  }
}
