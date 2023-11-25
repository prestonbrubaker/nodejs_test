$(function () {
    var socket = io();
    var messagesList = $('#messages');

    // Function to display a single message
    function displayMessage(data) {
        messagesList.append($('<li>').text(`[${data.timestamp}] ${data.msg} (IP: ${data.ip})`));
    }

    // Load previous chat messages from chatlog.json
    $.getJSON('/chatlog.json', function (data) {
        data.forEach(displayMessage);
    });

    // ...

    socket.on('chat message', function (data) {
        displayMessage(data);
        window.scrollTo(0, document.body.scrollHeight);
    });
});
