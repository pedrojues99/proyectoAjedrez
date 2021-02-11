
Alfil.prototype = Figura;
Torre.prototype = Figura;
Peon.prototype = Figura;
Caballo.prototype = Figura;
Rey.prototype = Figura;
Dama.prototype = Figura;
const src = "../imagenes/";
let tablero = new Tablero(idTablero);
let movimientos = new Array();

socket.on('ajedrez: movimiento', ({ posAntes, posAhora, movimiento, posicionC, accion }) => {
    nMovimientos = movimiento;
    posicion = posicionC;

    let yAntes = posAntes % 8;
    posAntes -= yAntes;
    let yAhora = posAhora % 8;
    posAhora -= yAhora;
    let casillaAntes = tablero.casillas[posAntes / 8][yAntes];
    let casillaAhora = tablero.casillas[posAhora / 8][yAhora];
    if (accion !== "Enroque") acciones(casillaAntes, casillaAhora)
    else enroque(casillaAntes, casillaAhora)

});
socket.on('ajedrez: finalizarPartida', ({ ganador }) => {
    debugger
    alert(`${ganador == id1 ? nombre1 : nombre2} HA GANADO LA PARTIDA`);
    //ABRIR MODAL PARA OPCIONES, VOLVER AL MENU, JUGAR OTRA PARTIDA....

});
mostrarHistorial = () => {
    var historial = document.getElementById("historial-container").style;
    var chat = document.getElementById("chat-container").style;
    chat.display = "none";
    historial.display = "block";
}

mostrarChat = () => {
    var historial = document.getElementById("historial-container").style;
    var chat = document.getElementById("chat-container").style;
    historial.display = "none";
    chat.display = "block";
}