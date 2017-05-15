var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var ev3 = require('ev3dev-lang');
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

var port = 3000;
var lock = false;
var steeringLock = false;
var lastKeyPressed = '';
var defaultSpeed = 1000;

var leftMotorPort = ev3.OUTPUT_A;
var rightMotorPort = ev3.OUTPUT_B;
var rotationMotorPort = ev3.OUTPUT_C;

var leftMotor = new ev3.LargeMotor(leftMotorPort);
var rightMotor = new ev3.LargeMotor(rightMotorPort);
var rotationMotor = new ev3.MediumMotor(rotationMotorPort);

var forward = '87';
var backwards = '83';
var left = '65';
var right = '68';

server.listen(port, function(){
  console.log('Listening on port: ' + port);
});
app.get('/', function(req, res){
  res.sendFile(__dirname + '/login.html');
});
app.get('/js/lib/socket.io.js', function(req, res){
  res.sendFile('/js/lib/socket.io.js');
});
app.get('/js/lib/jquery-3.2.1.min.js', function(req, res){
  res.sendFile('/js/lib/jquery-3.2.1.min.js');
});
app.get('/js/main.js', function(req, res){
  res.sendFile('/js/main.js');
});

app.post('/login', function(req, res){
  console.log('post received');
  if(req.body.pass == 'Oktopus'){
    res.sendFile(__dirname + '/main.html');
  }
});

io.on('connection', function(socket) {
  var address = socket.request.connection;
  console.log('Connection received from: ' + address.remoteAddress + ':' + address.remotePort);
  socket.emit('announcements', { message: 'A new user has joined!' });
  socket.on('event', function(data){
    if(data.message == forward && lock === false){
      console.log('drive forward');
      lastKeyPressed = forward;
      leftMotor.runForever(defaultSpeed);
      rightMotor.runForever(defaultSpeed);
      lock = true;
    }else if (data.message == backwards && lock === false) {
      console.log('drive backwards');
      lastKeyPressed = backwards;
      leftMotor.runForever(-defaultSpeed);
      rightMotor.runForever(-defaultSpeed);
      lock = true;
    }else if (data.message == 'keyup' && lastKeyPressed == data.key){
      console.log('stop driving');
      leftMotor.stop();
      rightMotor.stop();
      lock = false;
    }
  })
});
