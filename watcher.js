const watch = require('node-watch')
    , build = require('./index')
    , connect = require('connect')
    , serveStatic = require('serve-static')
    , http = require('http')
    , run = build.run;

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

var app = connect().use(serveStatic(build.OUT_DIR));
http.createServer(app).listen(8080, () => {
    console.log('Dev server listening on 8080.');
});