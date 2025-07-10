const path = require('path');
const cron = require('node-cron');
const dotenv = require('dotenv');
const fs = require('fs');
const chokidar = require('chokidar');
const { initRepo, commitAndPushSummary, getRecentCommits } = require('./gitCommitter');
const { generateSummary } = require('./summarizer');
const { addArticle, getRandomArticle } = require('./articleFetcher');

// loading environment variables
dotenv.config();

// Repo path and summaries directory
const repoPath = path.resolve(process.env.GIT_REPO_PATH || './activity_repo');
const summariesDir = path.join(repoPath, 'summaries');

// Track file changes
let changeBuffer = [];

// Watch code files (ignore node_modules, articles, etc)
chokidar.watch('.', { ignored: /(^|[\/\\])\..|node_modules|activity_repo|articles/ })
  .on('all', (event, filePath) => {
    console.log(`Detected: ${event} on ${filePath}`);
    changeBuffer.push(`${event}: ${filePath}`);
  });

// Init git repo once at start
(async () => {
  try {
    await initRepo();
  } catch (e) {
    console.error('Failed to init repo:', e);
  }
})();

// Cron job to summarize & commit every N minutes
cron.schedule(process.env.GIT_COMMIT_INTERVAL || '*/2 * * * *', async () => {
  console.log('⏳ Running summary cron job...');

  const changes = [...changeBuffer];
  changeBuffer = [];

  let summaryText = "";

  try {
    // 1: GPT summarizer
    summaryText = await generateSummary(changes);
    console.log('GPT summary generated');
  } catch (e) {
    console.error('GPT summarizer failed, fallback:', e.message);

    try {
      // 2: get recent commits
      const commits = await getRecentCommits();
      if (commits.length) {
        summaryText = "Manual fallback summary based on recent commits:\n" +
          commits.map(c => `- ${c.message}`).join('\n');
        console.log('Used commit history as fallback');
      } else {
        // 3: get new article & use it
        await addArticle();  // fetch new article into articles/
        summaryText = await getRandomArticle(); // read article content
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
