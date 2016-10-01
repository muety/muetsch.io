const http = require('http');

http.createServer(function (req, res) {
    console.dir(req.url);

    res.writeHead(200);
    res.end();

}).listen(3001);