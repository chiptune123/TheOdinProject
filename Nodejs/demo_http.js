var http = require('http');
var url = require('url');

http.createServer(function (req, res){
  res.writeHead(200, {'Content-Type': 'text/html'})
  res.write('Hello World!');
  var q = url.parse(req.url, true).query;
  var txt = q.year + " " + q.month;
  res.end(txt);

  res.end();
}).listen(8080);