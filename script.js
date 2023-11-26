$(function () {
    var socket = io(); // Initialize a socket connection using Socket.IO

    // Chat message submission
    $('#form').submit(function(e) {
        e.preventDefault();
        var message = $('#input').val();
        if (message) {
            socket.emit('chat message', { msg: message, timestamp: new Date().toLocaleTimeString() });
            $('#input').val('');
        }
    });

    // Listen for chat message updates from the server
    socket.on('chat message', function(data) {
        $('#messages').append($('<li>').text(`[${data.timestamp}] ${data.msg}`));
        window.scrollTo(0, document.body.scrollHeight);
    });

    // Character creation submission
    $('#character-form').submit(function(e) {
        e.preventDefault();
        var characterName = $('#char-name').val();
        var characterColor = $('#char-color').val();
        var x = Math.random() * canvas1.width;
        var y = Math.random() * canvas1.height;
        socket.emit('new rectangle', { characterName, characterColor, x, y });
    });

    // Canvas setup
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');
    canvas.width = 500; // Set appropriate size
    canvas.height = 500;

    // Listen for character updates from the server
    socket.on('update rectangles', function(rectangles) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rectangles.forEach(function(rect) {
            ctx.fillStyle = rect.characterColor;
            ctx.fillRect(rect.x, rect.y, 20, 20); // Adjust size as needed
            ctx.fillText(rect.characterName, rect.x, rect.y - 10); // Display name above rectangle
        });
    });

    // Initial load of characters
    $.getJSON('/rectangles', function(rectangles) {
        rectangles.forEach(function(rect) {
            ctx.fillStyle = rect.characterColor;
            ctx.fillRect(rect.x, rect.y, 20, 20); // Adjust size as needed
            ctx.fillText(rect.characterName, rect.x, rect.y - 10); // Display name above rectangle
        });
    });
});
