import { DiffResult } from '../agents/DiffAgent';
import { MetadataResult } from '../agents/MetadataAgent';

export class RuleEngine {
  analyze(diff: DiffResult, metadata: MetadataResult): string[] {
    console.log('[RuleEngine] Running static rule checks...');
    const findings: string[] = [];

    // Rule 1: Check for console.log
    if (diff.rawDiff.includes('+  console.log') || diff.rawDiff.includes('+\tconsole.log')) {
      findings.push('⚠️ Detected `console.log` statements being added.');
    }

    // Rule 2: Check for missing tests in new features
    if (metadata.intent === 'New feature' && !metadata.hasTests) {
      findings.push('⚠️ This PR appears to be a new feature, but no tests were detected.');
    }

    // Rule 3: Check for large PRs
    if (diff.insertions + diff.deletions > 500) {
      findings.push('⚠️ This is a large PR (>500 lines changed). Consider breaking it down into smaller PRs.');
    }

    return findings;
  }
}
