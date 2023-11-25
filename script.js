$(function () {
    var socket = io();
    var messagesList = $('#messages');

    function displayMessage(data) {
        messagesList.append($('<li>').text(`[${data.timestamp}] ${data.msg} (IP: ${data.ip})`));
    }

    $.getJSON('/chatlog.json', function (data) {
        data.forEach(displayMessage);
    });

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
        displayMessage(data);
        window.scrollTo(0, document.body.scrollHeight);
    });
});
