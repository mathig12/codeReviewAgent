import { BaseAgent, AgentContext } from './BaseAgent';
import { GithubAPI } from '../api/github';

export interface DiffResult {
  rawDiff: string;
  filesChanged: number;
  insertions: number;
  deletions: number;
  isMeaningful: boolean;
  changedFiles: string[];
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
    const changedFiles: string[] = [];

    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        filesChanged++;
        // Extract filename from `diff --git a/filename b/filename`
        const parts = line.split(' ');
        if (parts.length >= 3 && parts[2]) {
          const fileName = parts[2].substring(2); // Remove 'a/'
          changedFiles.push(fileName);
        }
      }
      else if (line.startsWith('+') && !line.startsWith('+++')) insertions++;
      else if (line.startsWith('-') && !line.startsWith('---')) deletions++;
    }

    // Determine if the PR is meaningful
    const trivialExtensions = ['.txt', '.md', '.gitignore', '.log'];
    const allTrivial = changedFiles.every(file => 
      trivialExtensions.some(ext => file.endsWith(ext))
    );
    
    // It's trivial if all files are trivial extensions OR if there are zero insertions/deletions.
    const isMeaningful = !allTrivial && (insertions > 0 || deletions > 0);

    return {
      rawDiff,
      filesChanged,
      insertions,
      deletions,
      isMeaningful,
      changedFiles
    };
  }
}
