let http = require('http');
let fs = require('fs');


http.createServer(function (req, res){
  fs.readFile('demofile1.html',function (err, data){
    res.writeHead(200, {'Content-type': 'text/html'});
    res.write(data);
  })
  fs.appendFile('mynewfile1.txt', 'Hello content!', function (err){
    if(err) throw err;
    console.log('saved');
  })
  
  fs.open('mynewfile2.txt','w',function(err,file){
    if(err) throw err;
    console.log('saved!');
  })
}).listen(8080);