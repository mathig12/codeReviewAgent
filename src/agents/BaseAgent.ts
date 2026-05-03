export interface AgentContext {
  prMetadata: {
    title: string;
    description: string;
    author: string;
    baseBranch: string;
    headBranch: string;
    diffUrl: string;
    prNumber: number;
    repoFullName: string;
    beforeSha?: string;
    afterSha?: string;
  };
  // Other shared state can go here
}

export abstract class BaseAgent<T> {
  protected context: AgentContext;

  constructor(context: AgentContext) {
    this.context = context;
  }

  abstract run(): Promise<T>;
}
