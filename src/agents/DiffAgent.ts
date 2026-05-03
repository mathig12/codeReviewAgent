import { BaseAgent, AgentContext } from './BaseAgent';
import { GithubAPI } from '../api/github';

export interface DiffResult {
  rawDiff: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
}

export class DiffAgent extends BaseAgent<DiffResult> {
  private githubApi: GithubAPI;

  constructor(context: AgentContext) {
    super(context);
    this.githubApi = new GithubAPI();
  }

  async run(): Promise<DiffResult> {
    console.log('[DiffAgent] Fetching and parsing diff...');
    
    const diffUrl = this.context.prMetadata.diffUrl;
    const rawDiff = await this.githubApi.getDiff(diffUrl);
    
    // Simple parsing heuristics
    const lines = rawDiff.split('\n');
    let filesChanged = 0;
    let insertions = 0;
    let deletions = 0;

    for (const line of lines) {
      if (line.startsWith('diff --git')) filesChanged++;
      else if (line.startsWith('+') && !line.startsWith('+++')) insertions++;
      else if (line.startsWith('-') && !line.startsWith('---')) deletions++;
    }

    return {
      rawDiff,
      filesChanged,
      insertions,
      deletions
    };
  }
}
