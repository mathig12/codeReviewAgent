import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const GITHUB_PAT = process.env.GITHUB_PAT;
if (!GITHUB_PAT) {
  console.error("❌ GITHUB_PAT environment variable is missing.");
  process.exit(1);
}

// Function to run shell commands
function runCmd(cmd: string) {
  console.log(`> ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim();
}

async function main() {
  try {
    console.log("🚀 Starting Trivial E2E PR Test (Meaningless Change)");

    // 1. Get repository info from git remote
    const remoteOriginUrl = runCmd('git config --get remote.origin.url');
    const repoMatch = remoteOriginUrl.match(/github\.com[/:](.+?)(?:\.git)?$/);
    if (!repoMatch || !repoMatch[1]) {
      throw new Error(`Could not determine GitHub repository from remote URL: ${remoteOriginUrl}`);
    }
    const repoFullName = repoMatch[1];
    console.log(`📦 Repository: ${repoFullName}`);

    // 2. Create a new branch
    const timestamp = Date.now();
    const branchName = `test-trivial-${timestamp}`;
    runCmd(`git checkout -b ${branchName}`);
    console.log(`🌿 Created branch: ${branchName}`);

    // 3. Make a trivial change (just a .txt file)
    const demoFilePath = path.join(__dirname, '..', `trivial-change-${timestamp}.txt`);
    const demoContent = `Just a meaningless text file change to test the trivial PR filter at ${timestamp}...`;
    fs.writeFileSync(demoFilePath, demoContent);
    console.log(`✍️ Created trivial file: trivial-change-${timestamp}.txt`);

    // 4. Commit and push the change
    runCmd(`git add trivial-change-${timestamp}.txt`);
    runCmd(`git commit -m "docs: minor trivial update ${timestamp}"`);
    console.log(`✅ Committed trivial change`);

    runCmd(`git push -u origin ${branchName}`);
    console.log(`☁️ Pushed branch ${branchName} to remote`);

    // 5. Raise a Pull Request via GitHub API
    console.log(`🐙 Creating Trivial Pull Request...`);
    const apiUrl = `https://api.github.com/repos/${repoFullName}/pulls`;
    
    let baseBranch = 'main';
    try {
      runCmd('git rev-parse --verify origin/main');
    } catch {
      try {
        runCmd('git rev-parse --verify origin/master');
        baseBranch = 'master';
      } catch {
        baseBranch = runCmd('git rev-parse --abbrev-ref HEAD');
      }
    }

    const prResponse = await axios.post(
      apiUrl,
      {
        title: `Trivial Test PR ${timestamp}`,
        body: 'This PR contains a meaningless change to test the agent\'s ability to skip trivial reviews.',
        head: branchName,
        base: baseBranch
      },
      {
        headers: {
          Authorization: `Bearer ${GITHUB_PAT}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    const prUrl = prResponse.data.html_url;
    console.log(`🎉 Success! Trivial Pull Request created at: ${prUrl}`);
    
    // Switch back to original branch
    runCmd(`git checkout ${baseBranch}`);
    console.log(`🔙 Switched back to ${baseBranch}`);
    
  } catch (error: any) {
    console.error('❌ Trivial automation failed:', error.message || error);
  }
}

main();
