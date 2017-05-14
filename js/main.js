var socket = io.connect('http://localhost:3000');
socket.on('announcements', function(data) {
    console.log('Got announcement:', data.message);
});

$(window).keydown(function(event){
    console.log('down');
    socket.emit('event', {message:'forward'});
});
$(window).keyup(function(event){
  console.log('up');
  socket.emit('event', {message:'keyup'});
});
