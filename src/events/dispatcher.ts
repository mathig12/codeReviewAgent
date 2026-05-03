import { ReviewOrchestrator } from '../orchestrator/ReviewOrchestrator';

export async function handleGithubWebhook(payload: any) {
  const action = payload.action;
  
  // We typically want to review when a PR is opened or synchronized (new commits)
  if (action === 'opened' || action === 'synchronize') {
    const prNumber = payload.pull_request.number;
    const repoFullName = payload.repository.full_name;
    const diffUrl = payload.pull_request.diff_url;
    
    console.log(`[Dispatcher] Received ${action} event for PR #${prNumber} in ${repoFullName}`);
    
    // Extract basic PR metadata
    const prMetadata = {
      title: payload.pull_request.title,
      description: payload.pull_request.body || '',
      author: payload.pull_request.user.login,
      baseBranch: payload.pull_request.base.ref,
      headBranch: payload.pull_request.head.ref,
      diffUrl,
      prNumber,
      repoFullName
    };

    // Trigger the orchestrator
    const orchestrator = new ReviewOrchestrator();
    await orchestrator.runReview(prMetadata);
  } else {
    console.log(`[Dispatcher] Ignoring PR action: ${action}`);
  }
}
