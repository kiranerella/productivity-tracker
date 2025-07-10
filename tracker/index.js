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

// Start the file watcher
const { startWatching } = require('./fileWatcher');

startWatching('./', (event, filePath) => {
    console.log(`[${event}] ${filePath}`);
    // TODO: To add logic to store diffs & prepare summary
});