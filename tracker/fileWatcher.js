const chokidar = require('chokidar');

let changedFiles = [];

// using chokidar to watch file changes and record them
function startWatching(pathToWatch) {
    const watcher = chokidar.watch(pathToWatch, {
        ignored: /node_modules|\.git/,
        persistent: true
    });

    watcher
        .on('add', path => recordChange('added', path))
        .on('change', path => recordChange('modified', path))
        .on('unlink', path => recordChange('deleted', path));

    console.log(`👀 Watching for file changes in ${pathToWatch}`);
}

// Identify the type of change and record it
function recordChange(type, filePath) {
    changedFiles.push({ type, filePath, time: new Date().toISOString() });
    console.log(`[${type}] ${filePath}`);
}

// Retrieve and clear the list of changed files
function getRecentChangesAndClear() {
    const recent = [...changedFiles];
    changedFiles = [];  // clear after taking snapshot
    return recent;
}

module.exports = { startWatching, getRecentChangesAndClear };
