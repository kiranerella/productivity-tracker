const chokidar = require('chokidar');

function startWatching(pathToWatch, onChangeCallback) {
    const watcher = chokidar.watch(pathToWatch, {
        ignored: /node_modules|\.git/,
        persistent: true
    });

    watcher
        .on('add', path => onChangeCallback('add', path))
        .on('change', path => onChangeCallback('change', path))
        .on('unlink', path => onChangeCallback('unlink', path));

    console.log(`👀 Watching for file changes in ${pathToWatch}`);
}

module.exports = { startWatching };
