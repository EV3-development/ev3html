var ev3 = require('ev3dev-lang');

var leftMotorPort = ev3.OUTPUT_A;
var rightMotorPort = ev3.OUTPUT_B;
var rotationMotorPort = ev3.OUTPUT_C;

var leftMotor = new ev3.LargeMotor(leftMotorPort);
var rightMotor = new ev3.LargeMotor(rightMotorPort);
var rotationMotor = new ev3.MediumMotor(rotationMotorPort);

console.log('engine maxSpeed: ' + leftMotor.maxSpeed());
console.log('rotation maxSpeed: ' + rotationMotor.maxSpeed());
