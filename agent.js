const http = require('http')
    , git = require('simple-git')('.')
    , build = require('./index')
    , run = build.run;

http.createServer(function(req, res) {
    console.log('Got webhook request.');
    if (req.headers['x-github-event'] === 'push') {
        console.log('Received GitHub push event');
        git.pull('origin', 'master', (err) => {
            if (err) return console.log(err);
            console.log('Pulled from remote.');
            run();
            console.log('Ran build script.');
        });
    }
    res.writeHead(200);
    res.end();
}).listen(3009);