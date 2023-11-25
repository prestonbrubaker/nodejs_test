$(function () {
    var socket = io();
    $('form').submit(function(e) {
        e.preventDefault();
        if ($('#input').val()) {
            const msg = $('#input').val();
            const timestamp = new Date().toLocaleTimeString();
            const ip = window.location.hostname;
            socket.emit('chat message', { msg, timestamp, ip });
            $('#input').val('');
        }
        return false;
    });
    socket.on('chat message', function(data){
        $('#messages').append($('<li>').text(`[${data.timestamp}] ${data.msg} (IP: ${data.ip})`));
        window.scrollTo(0, document.body.scrollHeight);
    });
});
