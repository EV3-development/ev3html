var socket = io.connect();
socket.on('announcements', function(data) {
    console.log('Got announcement:', data.message);
});

$(window).keydown(function(event){
    console.log('key pressed');
    socket.emit('event', {message:event.keyCode});
});
$(window).keyup(function(event){
  console.log(event.which);
  socket.emit('event', {message:'keyup', key:event.which});
});
