var socket = io.connect();
socket.on('announcements', function(data) {
    console.log('Got announcement:', data.message);
});

$(window).keydown(function(event){
    console.log('key pressed');
    socket.emit('event', {message:event.keyCode});
});
$(window).keyup(function(event){
  if(event.which == 65 || event.which == 68){
    socket.emit('event', {message:'steeringUp', key:event.which});
  };
  console.log(event.which);
  socket.emit('event', {message:'keyup', key:event.which});
});
