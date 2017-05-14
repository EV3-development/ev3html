var express = require('express');
var server = require('http').Server(app);

var app = express();

var port = 3000;
lock = false;

var io = require('socket.io').listen(app.listen(port, function(){
  console.log('Listening on port: ' + port);
}));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/main.html');
});
app.get('/js/lib/socket.io.js', function(req, res){
  res.sendFile(__dirname + '/js/lib/socket.io.js');
});
app.get('/js/lib/jquery-3.2.1.min.js', function(req, res){
  res.sendFile(__dirname + '/js/lib/jquery-3.2.1.min.js');
});
app.get('/js/main.js', function(req, res){
  res.sendFile(__dirname + '/js/main.js');
});

io.on('connection', function(socket) {
  console.log('connection received')
  socket.emit('announcements', { message: 'A new user has joined!' });

  socket.on('event', function(data){
    if(data.message == 'forward' && lock == false){
      console.log('drive forward');
      lock = true;
    }else if (data.message == 'keyup'){
      console.log('stop driving');
      lock = false;
    }
  })
});
