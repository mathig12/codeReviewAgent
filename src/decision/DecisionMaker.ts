import { DiffResult } from '../agents/DiffAgent';
import { ContextResult } from '../agents/ContextAgent';
import { MetadataResult } from '../agents/MetadataAgent';
import { AgentContext } from '../agents/BaseAgent';
import { GeminiEngine } from '../engine/GeminiEngine';
import { RuleEngine } from '../engine/RuleEngine';
import { GithubAPI } from '../api/github';

export class DecisionMaker {
  private llmEngine: GeminiEngine;
  private ruleEngine: RuleEngine;
  private githubApi: GithubAPI;

  constructor() {
    this.llmEngine = new GeminiEngine();
    this.ruleEngine = new RuleEngine();
    this.githubApi = new GithubAPI();
  }

  async makeDecision(
    diff: DiffResult,
    context: ContextResult,
    metadata: MetadataResult,
    prMetadata: AgentContext['prMetadata']
  ): Promise<void> {
    console.log('[DecisionMaker] Aggregating results and making a decision...');

    // 1. Run Rule Engine (Fast, synchronous checks)
    const ruleFindings = this.ruleEngine.analyze(diff, metadata);

    // 2. Run LLM Engine (Deep, semantic checks)
    const llmReview = await this.llmEngine.analyze(diff, context, metadata);

    // 3. Format the final output
    const finalComment = this.formatComment(llmReview, ruleFindings, prMetadata);

    // 4. Post back to GitHub
    await this.githubApi.postComment(
      prMetadata.repoFullName,
      prMetadata.prNumber,
      finalComment
    );
  }

  private formatComment(
    llmReview: string,
    ruleFindings: string[],
    prMetadata: AgentContext['prMetadata']
  ): string {
    let comment = `## 🤖 AI Code Review Agent\n\n`;
    
    comment += `**PR:** ${prMetadata.title} (#${prMetadata.prNumber})\n`;
    comment += `**Author:** @${prMetadata.author}\n\n`;

    if (ruleFindings.length > 0) {
      comment += `### 📋 Automated Static Checks\n`;
      ruleFindings.forEach(finding => {
        comment += `- ${finding}\n`;
      });
      comment += `\n`;
    }

    comment += `### 🧠 LLM Analysis\n\n`;
    comment += `${llmReview}\n\n`;

    comment += `---\n*This review was generated automatically by the AI Code Review Agent.*`;

    return comment;
  }
}
