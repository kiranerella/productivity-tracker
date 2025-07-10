const chokidar = require('chokidar');
const simpleGit = require('simple-git');
const cron = require('node-cron');
// This script tracks file changes in the current directory and commits them every 30 minutes.
const { summarizeChanges } = require('./summarizer');

const git = simpleGit();
const watcher = chokidar.watch('.', {
  ignored: /node_modules|\.git|articles/,
  ignoreInitial: true
});

let changeBuffer = [];

// Track file changes
watcher.on('all', (event, path) => {
  console.log(`Detected: ${event} on ${path}`);
  changeBuffer.push({ event, path });
});

// Commit every 30 min - can be adjusted as needed or use dynamic user defined intervals
cron.schedule('*/30 * * * *', async () => {
  if (changeBuffer.length === 0) {
    console.log('Idle mode: add article (todo)');
  } else {
    console.log('Committing summary...');
    await git.add('.');
    await git.commit(`chore: summary of ${changeBuffer.length} changes at ${new Date().toISOString()}`);
    changeBuffer = [];
  }
});
console.log('Tracker started...');


const { startWatching, getRecentChangesAndClear } = require('./fileWatcher');
const { generateSummary, saveSummaryToFile } = require('./summarizer');
const { initRepo, commitAndPushSummary } = require('./gitCommitter');

(async () => {
  await initRepo();
  startWatching('./');

  cron.schedule(process.env.GIT_COMMIT_INTERVAL, async () => {
    console.log('Generating summary...');
    const changes = getRecentChangesAndClear();
    const summary = await generateSummary(changes);
    const filePath = await saveSummaryToFile(summary);
    await commitAndPushSummary(filePath);
});
})();

const { getRecentCommits } = require('./gitCommitter');
const { getRandomArticle } = require('./articleFetcher');

cron.schedule(process.env.GIT_COMMIT_INTERVAL, async () => {
    console.log('⏳ Generating summary...');
    const changes = getRecentChangesAndClear();

    let summary = "";

    try {
        summary = await generateSummary(changes);
    } catch (e) {
        console.error('GPT summarizer failed, trying local commits');
        const commits = await getRecentCommits();
        if (commits.length) {
            summary = "Manual fallback summary based on recent commits:\n" +
                      commits.map(c => `- ${c.message}`).join('\n');
        } else {
            console.log('No commits found, using fallback article');
            summary = await getRandomArticle();
        }
    }

    const filePath = await saveSummaryToFile(summary);
    await commitAndPushSummary(filePath);
});
