import axios from 'axios';

export class GithubAPI {
  private token: string;

  constructor() {
    this.token = process.env.GITHUB_PAT || '';
    if (!this.token) {
      console.warn('⚠️ GITHUB_PAT is not set. API calls requiring authentication may fail.');
    }
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: 'application/vnd.github.v3+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  async getDiff(diffUrl: string): Promise<string> {
    try {
      const response = await axios.get(diffUrl, {
        headers: {
          // GitHub diff endpoints might require the token for private repos
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching diff from ${diffUrl}:`, error.message);
      throw error;
    }
  }

  async getCommitDiff(repoFullName: string, beforeSha: string, afterSha: string): Promise<string> {
    const url = `https://api.github.com/repos/${repoFullName}/compare/${beforeSha}...${afterSha}`;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching commit diff ${beforeSha}...${afterSha}:`, error.message);
      throw error;
    }
  }

  async postComment(repoFullName: string, prNumber: number, body: string): Promise<void> {
    const url = `https://api.github.com/repos/${repoFullName}/issues/${prNumber}/comments`;
    try {
      await axios.post(
        url,
        { body },
        { headers: this.getHeaders() }
      );
      console.log(`✅ Successfully posted review comment to PR #${prNumber}`);
    } catch (error: any) {
      console.error(`Error posting comment to PR #${prNumber}:`, error.response?.data || error.message);
      throw error;
    }
  }
}
