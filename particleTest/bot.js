/*var Particle = require("particle-io");
var five = require("johnny-five");*/
// var board = new Particle({
//   token: "1c9fdcf165f6f16e0ee2de4f9d37103ec3ed3841",
//   deviceId: "1c0020001547343339383037"
// });

var five = require("johnny-five");
var Particle = require("particle-io");
var board = new five.Board({
  io: new Particle({
    host: "192.168.1.2",
    port: 48879
  })
});

/*
var board = new Particle({
  host: "192.168.1.2",
  port: 48879
});
var board2 = new Particle({
  host: "192.168.1.4",
  port: 48879
});*/
/*
board.on("ready", function() {
  console.log("Device Ready..");
  /*var accelerometer = new five.Accelerometer({
   controller: "ADXL345"
 });*/
/*
  this.pinMode("D7", this.MODES.OUTPUT);
  this.pinMode("D2", this.MODES.OUTPUT);
  var byte = 0;
  var byte2 = 0;

  // This will "blink" the on board led
  setInterval(function() {
    this.digitalWrite("D7", (byte ^= 1));
    this.digitalWrite("D2", 1);
    console.log('Blinking');
  }.bind(this), 1500);


});*/
/*
board.on("ready", function() {
  var accelerometer = new five.Accelerometer({
    controller: "ADXL345"
  });
  var byte = 0;
  accelerometer.on("change", function() {
    console.log("accelerometer");
    console.log("  x            : ", this.x);
    console.log("  y            : ", this.y);
    console.log("  z            : ", this.z);
    console.log("  pitch        : ", this.pitch);
    console.log("  roll         : ", this.roll);
    console.log("  acceleration : ", this.acceleration);
    console.log("  inclination  : ", this.inclination);
    console.log("  orientation  : ", this.orientation);
    console.log("--------------------------------------");
  });
  setInterval(function() {
    this.digitalWrite("D7", (byte ^= 1));
    console.log('Blinking');
  }.bind(this), 1500);
});
*/
var register = {
  POWER: 0x2D,
  RANGE: 0x31,
  READ: 0xB2,
};
board.on("ready", function() {
  console.log("Ready");
    var byte = 0;
  var adxl345 = 0x53;
  var sensitivity = 0.00390625;

  // Enable I2C
  this.i2cConfig();

  // Toggle power to reset
  this.i2cWrite(adxl345, register.POWER, 0);
  this.i2cWrite(adxl345, register.POWER, 8);

  // Set range (this is 2G range)
  this.i2cWrite(adxl345, register.RANGE, 8);

  // Set register to READ position and request 6 bytes
  this.i2cRead(adxl345, register.READ, 46, function(data) {
    var x = (data[1] << 8) | data[0];
    var y = (data[3] << 8) | data[2];
    var z = (data[5] << 8) | data[4];

    // Wrap and clamp 16 bits;
    var X = (x >> 15 ? ((x ^ 0xFFFF) + 1) * -1 : x) * sensitivity;
    var Y = (y >> 15 ? ((y ^ 0xFFFF) + 1) * -1 : y) * sensitivity;
    var Z = (z >> 15 ? ((z ^ 0xFFFF) + 1) * -1 : z) * sensitivity;

    console.log("X: ", X);
    console.log("Y: ", Y);
    console.log("Z: ", z);
  });
  setInterval(function() {
    this.digitalWrite("D7", (byte ^= 1));
    console.log('Blinking');
  }.bind(this), 1500);
});
