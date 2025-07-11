const path = require('path');
const cron = require('node-cron');
const dotenv = require('dotenv');
const fs = require('fs');
const chokidar = require('chokidar');
const { initRepo, commitAndPushSummary, getRecentCommits } = require('./gitCommitter');
const { generateSummary } = require('./summarizer');
const { addArticle, getRandomArticle } = require('./articleFetcher');

dotenv.config();

const repoPath = path.resolve(process.env.GIT_REPO_PATH || './activity_repo');
const summariesDir = path.join(repoPath, 'summaries');
const branch = process.env.GIT_BRANCH || 'master';
const interval = process.env.GIT_COMMIT_INTERVAL || '*/2 * * * *';
const forceArticle = process.env.FORCE_ARTICLE === '1';

let changeBuffer = [];

// Watch source files (ignore noise)
chokidar.watch('.', { ignored: /(^|[\/\\])\..|node_modules|activity_repo|articles/ })
  .on('all', (event, filePath) => {
    console.log(`Detected: ${event} on ${filePath}`);
    changeBuffer.push(`${event}: ${filePath}`);
  });

// Init git repo once
(async () => {
  try {
    await initRepo();
  } catch (e) {
    console.error('Failed to init repo:', e);
  }
})();

// Cron: summarize & commit
cron.schedule(interval, async () => {
  console.log('Running summary cron job...');

  const changes = [...changeBuffer];
  changeBuffer = [];

  let summaryText = "";

  try {
    if (forceArticle) {
      console.log('⚡ FORCE_ARTICLE=1 → skipping GPT & commits, adding article');
      await addArticle();
      summaryText = await getRandomArticle();
    } else {
      // Try GPT summarizer
      summaryText = await generateSummary(changes);
      console.log('GPT summary generated');
    }
  } catch (e) {
    console.error('GPT summarizer failed, fallback:', e.message);

    try {
      const commits = await getRecentCommits();
      if (commits.length) {
        summaryText = "Manual fallback summary based on recent commits:\n" +
          commits.map(c => `- ${c.message}`).join('\n');
        console.log('Used commit history as fallback');
      } else {
        await addArticle();
        summaryText = await getRandomArticle();
        console.log('Used random article as fallback');
      }
    } catch (innerErr) {
      console.error('All fallbacks failed:', innerErr);
      summaryText = "Fallback: Unable to generate summary.";
    }
  }

  try {
    if (!fs.existsSync(summariesDir)) fs.mkdirSync(summariesDir, { recursive: true });
    const fileName = `summary-${new Date().toISOString().replace(/[:.]/g, '-')}.md`;
    const filePath = path.join(summariesDir, fileName);
    fs.writeFileSync(filePath, summaryText, 'utf8');
    console.log(`Saved summary: ${filePath}`);

    await commitAndPushSummary(filePath);
    console.log('Committed & pushed summary to repo');
  } catch (e) {
    console.error('Failed to save or push summary:', e);
  }
});
