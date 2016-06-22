//$Id$//
'use strict';
console.log("https configuration execute below commend in terminal under project");
console.log("openssl genrsa -out hacksparrow-key.pem 1024");
console.log("openssl req -new -key hacksparrow-key.pem -out certrequest.csr");
console.log("openssl x509 -req -in certrequest.csr -signkey hacksparrow-key.pem -out hacksparrow-cert.pem");

var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./webpack.config');
var https = require('https');
var fs = require('fs');
var key = fs.readFileSync('./hacksparrow-key.pem');
var cert = fs.readFileSync('./hacksparrow-cert.pem')
var WebSocketServer = require('ws').Server;
var url = require('url')

var https_options = {
    key: key,
    cert: cert
};

var app = express();
var compiler = webpack(config);


app.use(express.static("./dist/js"));

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist','index.html'));
});
var server = https.createServer(https_options, app);
var wss = new WebSocketServer({ server: server })
wss.on('connection', function connection(ws) {
  var location = url.parse(ws.upgradeReq.url, true);


  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('something');
});

server.listen(9090, 'localhost')
