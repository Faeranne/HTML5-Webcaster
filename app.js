var app = require('express').createServer()
  , io = require('socket.io').listen(app);
var live=false;
var streamsJSON = {count:1, video1:{address:""}}
var currentStream = "video1";
var port = process.env.PORT || 3000;
app.listen(port);
io.tryTransportsOnConnectTimeout=false;
io.rememberTransport=false;
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});
app.get('/video.ogg', function (req, res) {
  res.sendfile(__dirname + '/pass-countdown.ogg');
});
app.get('/controller/:code', function (req, res) {
  if(req.params.code!='1525'){
    res.send('bad code');
    return;
  }
  res.sendfile(__dirname + '/control.html');
});
app.get('/streamer/:code', function (req, res) {
  if(req.params.code!='1234'){
    res.send('bad code');
    return;
  }
  res.sendfile(__dirname + '/cast.html');
});

var client = io
  .of('/client')
  .on('connection', function (socket) {
  });
var controller = io
  .of('/controller')
  .on('connection', function (socket) {
  });
var streamer = io
  .of('/streamer')
  .on('connection', function(socket){
    socket.on('data', function(data){
      client.emit('data',data);
    });
  });
       
