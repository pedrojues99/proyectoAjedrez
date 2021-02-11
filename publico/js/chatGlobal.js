//DOM elements
const message = document.getElementById('message');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const chat = document.getElementById('chat-window');
enviar = () => {

    socket.emit('chatGlobal: message', {
        username: parametros[0],
        message: message.value
    });
    message.value = "";

}
debugger
btn.addEventListener('click', enviar);

document.addEventListener('keypress', ({ key }) => {
    if (key == "Enter") {
        enviar();
    }
})

socket.on('chatGlobal: message', ({ username, message }) => {

    output.innerHTML += `<p>
        <strong>${username}</strong>: ${message}
        </p>`;
    chat.scrollTop = chat.scrollHeight;
});