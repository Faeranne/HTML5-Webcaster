
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);
var port = process.env.PORT || 3000;

/* Test Data Below
audioCount=2;
videoCount=1; 	
audioName[0]='test';
audioAddr[0]='localhost';
audioName[1]='test2';
audioAddr[1]='localhost:3001';
videoName[0]='test3';
videoAddr[0]='localhost:3002';
*/

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/caster/:type/:code', routes.caster);
app.get('/controller', routes.control);

app.listen(port);

// Socket.io
// ---------
// client  
var client = io
  .of('/client')
  .on('connection', function (socket) {   
    socket.emit('reload');
    if(routes.audioCasterName.length>0){
      for(var i = 0;i<routes.audioCasterName.length;i++){
        socket.emit('add audio',routes.audioCasterName[i]);
      }
    }
    if(routes.videoCasterName.length>0){
      for(var i = 0;i<routes.videoCasterName.length;i++){
        socket.emit('add video',routes.videoCasterName[i]);
      }
    }
  });

// caster

var caster = io
  .of('/cast')
  .on('connection', function (socket) {   
    socket.emit('reload');   
    socket.on('readyVideo', function (name){
      controller.emit('video ready', name);
    });
    socket.on('readyAudio', function (name){
      controller.emit('audio ready', name);
    });
  });
var controller = io
  .of('/control')
  .on('connection', function (socket) {
    socket.emit('reload');
    socket.on('reboot', function (){
      setVars();
      reconnect();
    });
    socket.on('start stream',function (){
      client.emit('start stream');
      controller.emit('start stream');
    });
    socket.on('stop stream', function (){
      client.emit('stop stream');
      controller.emit('stop stream');
    });
    socket.on('start video', function (name){
      client.emit('start video', name);
      controller.emit('start video', name);
    });
    socket.on('new video stream', function (event){
      var id = event.id;
      var code = event.code;
        var z = routes.videoCasterCode.length;
        routes.videoCasterCode[z] = code;
        routes.videoCasterName[z] = id;
        client.emit('add video', id);
        controller.emit('add video', id);
    });
    socket.on('new audio stream', function (event){
      var id = event.id;
      var code = event.code;
        var z = routes.audioCasterCode.length;
        routes.audioCasterCode[z] = code;
        routes.audioCasterName[z] = id;
        client.emit('add audio', id);
        controller.emit('add audio', id);
    });
  });

function setVars(){
  routes.audioCasterCode=new Array();
  routes.audioCasterName=new Array();
  routes.videoCasterCode=new Array();
  routes.videoCasterName=new Array();
}

function restart(){
  client.emit('reload');
  caster.emit('reload');
  controller.emit('reload');
}

