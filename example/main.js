$(function() {
    const socket = io({
        autoConnect: false
    });

    socket.connect();

    var messages = document.getElementById('messages');
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    var msgcount = 0;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('sub', input.value);
            input.value = '';
        }
    });

    socket.on('payload', function(msg) {
        // clear page element, avoid browser crash.
        if (msgcount >= 100) {
            messages.innerHTML = '';
            msgcount = 0;
        };
        var item = document.createElement('li');
        item.textContent = msg;
        ++msgcount;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on("disconnect", () => {
        socket.connect();
    });
});