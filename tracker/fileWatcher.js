const chokidar = require('chokidar');

let changedFiles = [];

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

function recordChange(type, filePath) {
    changedFiles.push({ type, filePath, time: new Date().toISOString() });
    console.log(`[${type}] ${filePath}`);
}

function getRecentChangesAndClear() {
    const recent = [...changedFiles];
    changedFiles = [];  // clear after taking snapshot
    return recent;
}

module.exports = { startWatching, getRecentChangesAndClear };
