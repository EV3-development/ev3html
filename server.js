var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var ev3 = require('ev3dev-lang');
var crypto = require('crypto');
var io = require('socket.io')(server);
var async = require('async');
//leuchtende buttons
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

var port = 6985;
var lock = false;
var steeringLock = false;
var shift = false;
var lastKeyPressed = '';
var lastSteeringPressed = '';
var hash = '33104191484a4d9d06bb2c11db5b2c6b'
var defaultSpeed = 1000;
var count = 1;
var rotation = 0;

var leftMotorPort = ev3.OUTPUT_A;
var rightMotorPort = ev3.OUTPUT_C;
var rotationMotorPort = ev3.OUTPUT_B;

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
app.get('/css/MainStyle.css', function(req, res){
  res.sendFile('/css/MainStyle.css');
});
app.get('/css/LoginStyle.css', function(req, res){
  res.sendFile('/css/LoginStyle.css');
});

app.post('/login', function(req, res){
  console.log('post received');
  if(hash == crypto.createHash('md5').update(req.body.pass).digest('hex')){
    res.sendFile(__dirname + '/main.html');
  }
});

var increment = function(cb){
  async.whilst(function(){return steeringLock===true;},
    function(callback){
      count++
      if(rotation < 100){
        rotation = rotation + 10;
      }
      //console.log('increment called')
      cb(rotation);
      setTimeout(callback, count * 250)
    },
    function(err){
      count = 1;
      rotation = 0;
    }
  )
};

io.on('connection', function(socket) {
  var address = socket.request.connection;
  console.log('Successful login received from: ' + address.remoteAddress + ':' + address.remotePort);
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
    }else if (data.message == left && steeringLock === false) {
      console.log('turn left');
      rotationMotor.runToPosition(-25, 200);
      lastSteeringPressed = data.message;
      steeringLock = true;
      console.log(increment(function(id){console.log(id)}));
    }else if (data.message == right && steeringLock === false) {
      console.log('turn right');
      rotationMotor.runForever(20);
      lastSteeringPressed = data.message;
      steeringLock = true;
      console.log(increment(function(id){console.log(id)}));
    }else if (data.message == 'steeringUp' && lastSteeringPressed == data.key) {
      console.log('stop steering');
      rotationMotor.runToPosition(0, 200)
      rotationMotor.stop(0);
      steeringLock = false;
    }
  })
});
