var app = require('express').createServer()
  , io = require('socket.io').listen(app);
var live=false;
var streamsJSON = {count:1, video1:{address:""}}
var currentStream = "video1";
app.listen(8000);

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
    socket.on('init client', function(){
      if(live){
        socket.emit('init return',{live:live,active:currentStream,streams:streamsJSON});
      }
    });
  });
var controller = io
  .of('/controller')
  .on('connection', function (socket) {
    socket.on('init', function(){
      socket.emit('init return', {live:live,active:currentStream,streams:streamsJSON});
    });
    socket.on('feedcontrol', function (items) {
      console.log("feed control :"+items.live+" - "+items.feed);
      client.emit('feed',items);
      controller.emit('set live', items);
      streamsJSON[items.stream].live=items.live
    });
    socket.on('live select', function(stream){
      client.emit('live select', stream);
      controller.emit('current', stream);
      currentStream=stream; 
    });
  });
var streamer = io
  .of('/streamer')
  .on('connection', function(socket){
    socket.on('new stream', function(items){
      streamsJSON[items.stream].address=items.address;
      socket.emit('stream set');
    });
    socket.on('set live', function(items){
      streamsJSON[items.stream].streaming=items.streaming;
      controller.emit('stream avalible',items);
      client.emit('stream avalible',items);
    });
  });
       
