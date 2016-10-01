const http = require('http')
    , git = require('simple-git')('.')
    , build = require('./index')
    , run = build.run;

http.createServer(function(req, res) {
    if (req.headers['x-github-event'] === 'push') {
        git.pull('github', 'master', (err) => {
            if (!err) run();
            else console.log(err);
        });
    }

    res.writeHead(200);
    res.end();
}).listen(3009);