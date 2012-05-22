
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var app = module.exports = express.createServer()
  , io = require('socket.io').listen(app);

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

app.listen(3000);

// Socket.io
// ---------
// client:functions  
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

var caster = io
  .of('/cast')
  .on('connection', function (socket) {   
    socket.emit('reload');   
    
  });

