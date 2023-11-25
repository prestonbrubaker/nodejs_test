
// script.js
$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault();
        if ($('#input').val()) {
            socket.emit('chat message', $('#input').val());
            $('#input').val('');
        }
        return false;
    });
    socket.on('chat message', function(msg){
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });
});
