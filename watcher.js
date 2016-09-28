const watch = require('node-watch')
    , run = require('./index');

var watcher = watch('./src', { recursive: true });
var blocked = false;

watcher.on('change', (filename) => {
    if (!blocked) {
        console.log(`${filename} changed...`);
        run(true);
        blocked = true;

        setTimeout(() => {
            blocked = false;
        }, 1000);
    }
});