$(function () {
    var socket = io(); // Initialize a socket connection using Socket.IO

    // Function to display a single chat message
    function displayMessage(data) {
        $('#messages').append($('<li>').text(`[${data.timestamp}] ${data.msg} (IP: ${data.ip})`));
    }

    // Load initial chat messages from chatlog.json
    function loadChatLog() {
        $.getJSON('/chatlog.json', function (data) {
            data.forEach(displayMessage);
        });
    }

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
        displayMessage(data);
        window.scrollTo(0, document.body.scrollHeight);
    });
});



var c = document.getElementById("canvas1");
var ctx = c.getContext("2d");
var characterName = 0;
var characterColor = "#ff0000";

document.getElementById('character-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var characterName = document.getElementById('char-name').value;
    var characterColor = document.getElementById('char-color').value;
    ctx.fillStyle = characterColor;
    var x = Math.random() * 100;
    var y = Math.random() * 100;
    ctx.fillRect(x, y, 5, 5);

    // Emit an event to the server with the rectangle data
    socket.emit('new rectangle', { characterName, characterColor, x, y });
});

    // Canvas setup
    var canvas = document.getElementById('canvas1');
    var ctx = canvas.getContext('2d');
    canvas.width = 500; // Set appropriate size
    canvas.height = 500;

    // Function to draw characters on canvas
    function drawCharacters(rectangles) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rectangles.forEach(function(rect) {
            ctx.fillStyle = rect.characterColor;
            ctx.fillRect(rect.x, rect.y, 20, 20); // Adjust size as needed
            ctx.fillText(rect.characterName, rect.x, rect.y - 10); // Display name above rectangle
        });
    }

    // Load initial characters from rectangles.json
    function loadRectangles() {
        $.getJSON('/rectangles', function(rectangles) {
            drawCharacters(rectangles);
        });
    }

    // Listen for character updates from the server
    socket.on('update rectangles', function(rectangles) {
        drawCharacters(rectangles);
    });

    // Initial load of messages and characters
    loadChatLog();
    loadRectangles();
});
