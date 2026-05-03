import { BaseAgent, AgentContext } from './BaseAgent';

export interface MetadataResult {
  intent: string;
  isAutomated: boolean;
  hasTests: boolean;
  complexity: 'low' | 'medium' | 'high';
}

export class MetadataAgent extends BaseAgent<MetadataResult> {
  constructor(context: AgentContext) {
    super(context);
  }

  async run(): Promise<MetadataResult> {
    console.log('[MetadataAgent] Extracting PR metadata...');
    
    const { title, description, author } = this.context.prMetadata;
    
    // Simple heuristic-based extraction for demonstration
    const lowerTitle = title.toLowerCase();
    const lowerDesc = description.toLowerCase();
    
    const isAutomated = author.includes('bot') || author.includes('dependabot');
    const hasTests = lowerTitle.includes('test') || lowerDesc.includes('test');
    
    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (description.length > 500) complexity = 'high';
    else if (description.length > 200) complexity = 'medium';

    let intent = 'General update';
    if (lowerTitle.includes('fix') || lowerTitle.includes('bug')) intent = 'Bug fix';
    else if (lowerTitle.includes('feat') || lowerTitle.includes('add')) intent = 'New feature';
    else if (lowerTitle.includes('refactor')) intent = 'Refactoring';
    else if (lowerTitle.includes('chore')) intent = 'Chore/Maintenance';

    return {
      intent,
      isAutomated,
      hasTests,
      complexity
    };
  }
}
