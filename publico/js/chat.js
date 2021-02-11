//DOM elements
const message = document.getElementById('message');
const username = document.getElementById('username');
const btn = document.getElementById('send');
const output = document.getElementById('output');
const actions = document.getElementById('actions');
const chat = document.getElementById('chat-window');
let timeout;
borrarAccion = () => {
    actions.innerHTML = "";
}

enviar = () => {
    console.log("funciona");
    socket.emit('chatAjedrez: message', {
        username: username.value,
        message: message.value,
        codigoSala: codigoSala
    });
    message.value = "";

}
btn.addEventListener('click', enviar);

document.addEventListener('keypress', ({ key }) => {
    if (key == "Enter") {
        enviar();
    }
})

message.addEventListener('keypress', ({ key }) => {
    socket.emit('chatAjedrez: typing', {
        username: username.value,
        key: key,
        codigoSala: codigoSala
    })
})
socket.on('chatAjedrez: message', ({ username, message }) => {
    if (actions.innerText.split(" ")[0] == username) {
        clearTimeout('timeout')
        actions.innerHTML = "";
    }

    output.innerHTML += `<p>
        <strong>${username}</strong>: ${message}
        </p>`;
    chat.scrollTop = chat.scrollHeight;
});

socket.on('chatAjedrez: typing', ({ key, username }) => {
    if (key == "Enter") {
        actions.innerHTML = "";
    }
    else {
        actions.innerHTML = `<p class="text-white">
        <em><strong>${username}</strong> está escribiendo...</em>

</p>`;


        timeout = setTimeout('borrarAccion()', 10000);
    }
})