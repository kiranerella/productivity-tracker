const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');
// dotenv is used to load environment variables from a .env file
require('dotenv').config();

const repoPath = process.env.GIT_REPO_PATH;
const remoteUrl = process.env.GIT_REMOTE_URL;
// This function initializes the git repository if it doesn't exist.
async function initRepo() {
    if (!fs.existsSync(repoPath)) {
        console.log('Cloning repo...');
        await simpleGit().clone(remoteUrl, repoPath);
    }
}
// This function commits the summary file to the git repository and pushes it to the remote.
async function commitAndPushSummary(summaryFilePath) {
    const git = simpleGit(repoPath);

    try {
        await git.add(path.relative(repoPath, summaryFilePath));
        await git.commit(`feat: add summary ${path.basename(summaryFilePath)}`);
        await git.push('origin', 'master');
        console.log(`Pushed summary to repo`);
    } catch (e) {
        console.error('Failed to push:', e);
    }
}
// This function retrieves the most recent commits from the repository.
async function getRecentCommits(limit=5) {
    const git = simpleGit(repoPath);
    try {
        const log = await git.log({ n: limit });
        return log.all;
    } catch (e) {
        console.error('Failed to get commits:', e);
        return [];
    }
}
// This module handles git operations for committing summaries and pushing to a remote repository.
module.exports = { initRepo, commitAndPushSummary, getRecentCommits };
