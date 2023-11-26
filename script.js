$(function () {
    var socket = io(); // Initialize a socket connection using Socket.IO

    var messagesList = $('#messages'); // Select the HTML element to display messages

    // Function to display a single message
    function displayMessage(data) {
        // Append a new list item to the messages list with the formatted message
        messagesList.append($('<li>').text(`[${data.timestamp}] ${data.msg} (IP: ${data.ip})`));
    }

    // Function to load previous chat messages from the server
    function loadChatLog() {
        // Make an AJAX request to get the chat log
        $.getJSON('/chatlog.json', function (data) {
            // For each message in the chat log, display it
            data.forEach(displayMessage);
        });
    }

    // Call the function to load the chat log when the page loads
    loadChatLog();

    // Event listener for form submission
    $('form').submit(function(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        if ($('#input').val()) {
            // Get message, current timestamp, and IP address
            const msg = $('#input').val();
            const timestamp = new Date().toLocaleTimeString();
            const ip = window.location.hostname;
            // Emit a 'chat message' event with the message data
            socket.emit('chat message', { msg, timestamp, ip });
            // Clear the input field after sending the message
            $('#input').val('');
        }
        return false;
    });

    // Listen for 'chat message' events from the server
    socket.on('chat message', function(data){
        // Display the received message and scroll to the bottom of the page
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
    ctx.fillRect(10, 10, 50, 50);
})



