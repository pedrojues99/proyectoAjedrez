
/* AJEDREZ */

ponerImagen = (casillaAhora) => {
    if (casillaAhora) {
        let img = document.createElement("img");
        img.setAttribute("src", casillaAhora.figura.imagen);
        return img;
    }
}

comprobarVictoria = (reyTurno, color) => {
    let casillas = tablero.casillas;

    reiniciarCasillasAmenazadas();
    for (let i = 0, x = 0; x < casillas.length; x++) {
        for (let y = 0; y < casillas[x].length; y++, i++) {
            let casilla = casillas[x][y];

            if (casilla.figura && color !== casilla.figura.tipo) {
                casilla.figura.posiblesMovimientos("amenaza");
            }

        }
    }
    //COMPROBACION AQUI

    let partidaAcabada = true;
    for (let i = 0; i < posiblesAcciones.length && partidaAcabada; i++) {
        if (posiblesAcciones[i].casillaAmenazada) {
            let spliteado = posiblesAcciones[i].casillaAmenazada.split("");
            if (tablero.casillas[spliteado[0]][spliteado[1]].figura.nombre !== "Rey") {
                partidaAcabada = false;
            } else {
                partidaAcabada = true;
            }

        }
    }
    reiniciarCasillasAmenazadas();
    for (let i = 0, x = 0; x < casillas.length; x++) {
        for (let y = 0; y < casillas[x].length; y++, i++) {
            let casilla = casillas[x][y];
            $(`#${casilla.posCasilla}`).off();

            if (color === casilla.figura.tipo) {

                casilla.figura.posiblesMovimientos("amenaza");
            }
            else {
                $(`#${casilla.posCasilla}`).on("click", mostrar);
            }
        }
    }

    if (partidaAcabada) {
        partidaAcabada = reyTurno.figura.posiblesMovimientos("CVictoria")
    }
    let id = (nMovimientos % 2 === 0) ? id2 : id1;

    if (partidaAcabada) {
        socket.emit('ajedrez: finalizarPartida', {
            posicion: posicion,
            movimiento: nMovimientos,
            codigoSala: codigoSala,
            ganador: id,
            idPartida: tablero.id
        })
    }

    comprobarAmenaza(reyTurno);

}

coronacion = (casillaAntes, xAhora) => {

    if (casillaAntes != null && xAhora != null) {

        if (casillaAntes.figura.tipo == "Blanco" && xAhora == 7) {
            return casillaAntes.figura.cambiarFigura();
        }
        if (casillaAntes.figura.tipo == "Negro" && xAhora == 0) {
            return casillaAntes.figura.cambiarFigura();
        }

    }
}
accionMover = (casillaAntes, casillaAhora) => {

    casillaAhora.ponerFigura();
    casillaAntes.ponerFigura();

    return { casillaAhora: casillaAhora, casillaAntes: casillaAntes }
}
hacerEnroque = (casillaTorreAntes, casillaTorreAhora, casillaAntes, casillaAhora, spliteado) => {

    if (casillaAntes.figura.tipo === "Negro") {
        spliteado[casillaAhora.posCasilla] = "E";
        spliteado[casillaTorreAhora.posCasilla] = "G";
    } else {
        spliteado[casillaAhora.posCasilla] = "D";
        spliteado[casillaTorreAhora.posCasilla] = "F";
    }

    spliteado[casillaTorreAntes.posCasilla] = "0";
    spliteado[casillaAntes.posCasilla] = "0";

    return spliteado;
}
mover = (xAntes, yAntes, xAhora, yAhora, accion = null) => {
    debugger
    let casillaAntes = tablero.casillas[xAntes][yAntes];
    let casillaAhora = tablero.casillas[xAhora][yAhora];

    let spliteado = posicion.split("");
    //SE COMPRUEBA LA DIRECCION A DONDE SE QUIERE IR CON EL REY, DEPENDIENDO DE UNA U OTRA, SE SABE LA POSICION DE LA TORRE. SE GUARDA EN POSICION EL CARACTER ASOCIADO A TORRE Y REY DE SU COLOR CON MOVIDO TRUE
    if (casillaAntes.figura) {
        if (accion === "Enroque") {
            if (casillaAntes.y > casillaAhora.y) {
                let casillaTorreAntes = tablero.casillas[casillaAhora.x][casillaAhora.y - 2];
                let casillaTorreAhora = tablero.casillas[casillaAhora.x][casillaAhora.y + 1];
                spliteado = hacerEnroque(casillaTorreAntes, casillaTorreAhora, casillaAntes, casillaAhora, spliteado)
            } else {
                let casillaTorreAntes = tablero.casillas[casillaAhora.x][casillaAhora.y + 1];
                let casillaTorreAhora = tablero.casillas[casillaAhora.x][casillaAhora.y - 1];
                spliteado = hacerEnroque(casillaTorreAntes, casillaTorreAhora, casillaAntes, casillaAhora, spliteado)
            }
        }
        else {

            if (casillaAntes.figura.nombre === "Peon") {
                if (casillaAntes.figura.tipo == "Blanco" && xAhora == 7) {
                    spliteado[casillaAhora.posCasilla] = coronacion(casillaAntes, xAhora);
                }
                else if (casillaAntes.figura.tipo == "Negro" && xAhora == 0) {
                    spliteado[casillaAhora.posCasilla] = coronacion(casillaAntes, xAhora);
                }
                else {
                    spliteado[casillaAhora.posCasilla] = spliteado[casillaAntes.posCasilla] == 2 ? "F" : spliteado[casillaAntes.posCasilla] == 8 ? "G" : spliteado[casillaAntes.posCasilla] == 6 ? "D" : spliteado[casillaAntes.posCasilla] == "C" ? "E" : spliteado[casillaAntes.posCasilla];

                }
            }
            else {
                spliteado[casillaAhora.posCasilla] = spliteado[casillaAntes.posCasilla] == 2 ? "F" : spliteado[casillaAntes.posCasilla] == 8 ? "G" : spliteado[casillaAntes.posCasilla] == 6 ? "D" : spliteado[casillaAntes.posCasilla] == "C" ? "E" : spliteado[casillaAntes.posCasilla];
            }
            spliteado[casillaAntes.posCasilla] = "0";
        }


        posicion = spliteado.join("");

        // let figura = casillaAntes.figura;
        socket.emit('ajedrez: movimiento', {
            posicion: posicion,
            movimiento: nMovimientos,
            codigoSala: codigoSala,
            posAhora: casillaAhora.posCasilla,
            posAntes: casillaAntes.posCasilla,
            idPartida: tablero.id,
            accion: accion
        })
    }
    else {
        alert("Debes refrescar la página, gracias")
    }
}


function ponerNormalTotalSinAzul() {
    for (let i = 0, x = 0; x < tablero.casillas.length; x++) {
        for (let y = 0; y < tablero.casillas.length; y++, i++) {

            if (tablero.casillas[x][y].CColor != 5 && tablero.casillas[x][y].CColor != 4) {
                if (((x + y) % 2) === 0) {
                    tablero.casillas[x][y].CColor = 0;
                } else {
                    tablero.casillas[x][y].CColor = 1; //true blanco false negro
                }
                actualizarUno(tablero.casillas[x][y]);
                if (tablero.casillas[x][y].figura.tipo === "Negro" && tablero.turno % 2) {

                    $(`#${tablero.casillas[x][y].posCasilla}`).off();
                    $(`#${tablero.casillas[x][y].posCasilla}`).on("click", mostrar)
                }
                else if (tablero.casillas[x][y].figura.tipo === "Blanco" && !(tablero.turno % 2)) {

                    $(`#${tablero.casillas[x][y].posCasilla}`).off();
                    $(`#${tablero.casillas[x][y].posCasilla}`).on("click", mostrar)

                }

            }
        }
    }
}
enroque = (casillaAntes, casillaAhora) => {
    if (casillaAntes.y > casillaAhora.y) {
        let casillaTorreAntes = tablero.casillas[casillaAhora.x][casillaAhora.y - 2];
        let casillaTorreAhora = tablero.casillas[casillaAhora.x][casillaAhora.y + 1];
        accionMover(casillaTorreAntes, casillaTorreAhora);
    } else {
        let casillaTorreAntes = tablero.casillas[casillaAhora.x][casillaAhora.y + 1];
        let casillaTorreAhora = tablero.casillas[casillaAhora.x][casillaAhora.y - 1];
        accionMover(casillaTorreAntes, casillaTorreAhora);
    }
    acciones(casillaAntes, casillaAhora)
}
function acciones(casillaAntes, casillaAhora) {
    reiniciarCasillasAmenazadas();
    movimientos[movimientos.length] = new Movimiento(casillaAntes, casillaAhora);
    ({ casillaAntes, casillaAhora } = accionMover(casillaAntes, casillaAhora));
    ponerFinTurno(casillaAhora.figura.tipo);
    let figura = casillaAhora.figura;
    cambiarTurno();

}
casillasParaBloquear = (casilla) => {

    let spliteado = casilla.casillaAmenazada.split("-");
    if (spliteado.length > 1) {
        return true;
    }
    else {
        let arrayCasillas = [];
        let x = casilla.x;
        let y = casilla.y;
        let xAmenazante = casilla.casillaAmenazada.split("")[0];
        let yAmenazante = casilla.casillaAmenazada.split("")[1];


        if (x == xAmenazante) {
            while (y != yAmenazante) {
                if (y > yAmenazante) {
                    arrayCasillas.push(tablero.casillas[x][--y]);
                }
                else if (y < yAmenazante) {
                    arrayCasillas.push(tablero.casillas[x][++y]);
                }
            }
        }
        else if (y == yAmenazante) {
            while (x != xAmenazante) {
                if (x < xAmenazante) {
                    arrayCasillas.push(tablero.casillas[++x][y]);
                }
                else if (x > xAmenazante) {
                    arrayCasillas.push(tablero.casillas[--x][y]);
                }
            }
        }
        else {

            function comprobarCaballo() {
                if (Math.abs(x - xAmenazante) !== Math.abs(y - yAmenazante)) {
                    arrayCasillas.push(tablero.casillas[xAmenazante][yAmenazante]);
                    return true;
                }
                else return false;

            }
            let caballo = comprobarCaballo();

            //Si pruebas caballo es true, significa que está siendo atacado por un caballo por lo que no debo identificar la trayectoria
            while (x != xAmenazante && y != yAmenazante && !caballo) {
                if (x < xAmenazante) {
                    if (y < yAmenazante) {
                        arrayCasillas.push(tablero.casillas[++x][++y]);
                    }
                    else if (y > yAmenazante) {
                        arrayCasillas.push(tablero.casillas[++x][--y]);
                    }
                }
                else if (x > xAmenazante) {
                    if (y < yAmenazante) {
                        arrayCasillas.push(tablero.casillas[--x][++y]);
                    }
                    else if (y > yAmenazante) {
                        arrayCasillas.push(tablero.casillas[--x][--y]);
                    }
                }
            }
        }

        return arrayCasillas;
    }
}
comprobarAmenaza = (casilla) => {
    if (casilla.casillaAmenazada) {
        casilla.CColor = 5;
        actualizarUno(casilla);
        return casillasParaBloquear(casilla);
    }
    else {
        return false;
    }
}

reiniciarCasillasAmenazadas = () => {

    let casillas = tablero.casillas;
    for (let x = 0; x < casillas.length; x++) {
        for (let y = 0; y < casillas[x].length; y++) {
            casillas[x][y].casillaAmenazada = false;
            casillas[x][y].casillaAlmacenada = false;
            casillas[x][y].CColor = (((x + y) % 2) === 0) ? 0 : 1;
            actualizarUno(casillas[x][y]);
        }
    }
}

//ESTA FUNCION CAMBIA DE COLOR LAS CASILLAS AL CAMBIAR EL TURNO Y AMENAZA CASILLAS
function ponerFinTurno(color) {
    let casillas = tablero.casillas;
    let reyTurno;
    for (let i = 0, x = 0; x < casillas.length; x++) {
        for (let y = 0; y < casillas[x].length; y++, i++) {
            let casilla = casillas[x][y];
            $(`#${casilla.posCasilla}`).off();

            if (color === casilla.figura.tipo) {
                casilla.figura.posiblesMovimientos("amenaza");
            }
            else {
                $(`#${casilla.posCasilla}`).on("click", mostrar);
                if (casilla.figura.nombre === "Rey") reyTurno = casilla;
            }
        }
    }
    posiblesAcciones = comprobarAmenaza(reyTurno);

    if (posiblesAcciones) {
        comprobarVictoria(reyTurno, color);
    }
}

function mostrar(e) {
    ponerNormalTotalSinAzul()
    let x = e.currentTarget.getAttribute("x");
    let y = e.currentTarget.getAttribute("y");

    if (nMovimientos % 2 == 0 && id1 == idPropio && tablero.casillas[x][y].figura.tipo === "Blanco") {
        tablero.casillas[x][y].figura.posiblesMovimientos("mostrar");
    }
    else if (nMovimientos % 2 == 1 && id2 == idPropio && tablero.casillas[x][y].figura.tipo === "Negro") {
        tablero.casillas[x][y].figura.posiblesMovimientos("mostrar");

    }

}
//Quizas obsoleto

function actualizarUno(casilla) {
    let boton = casilla.boton;
    // 0 y 1 colores normales del tablero, 2 posicion valida, 3 posicion de ataque, 4 posicion de defensa
    boton.style.backgroundColor =
        (casilla.CColor == 0) ? "black" :
            (casilla.CColor == 1) ? "antiquewhite" :
                (casilla.CColor == 2) ? "71DB43" :
                    (casilla.CColor == 3) ? "DE4242" :
                        (casilla.CColor == 4) ? "33B2FF" : "DE4242";

}

function movimientosColor(casillaAntes, casillaAhora, accion) {
    //Si la figura tiene que bloquar alguna casilla

    if (casillaAntes.CColor !== 4) {
        if (posiblesAcciones) {
            if (casillaAntes.figura.nombre !== "Rey") {
                for (let x = 0; x <= posiblesAcciones.length; x++) {
                    if (posiblesAcciones[x] == casillaAhora) {
                        colorEvento(accion, casillaAntes, casillaAhora)
                    }
                }
            }
            else {

                colorEvento(accion, casillaAntes, casillaAhora)

            }
        }
        else {
            colorEvento(accion, casillaAntes, casillaAhora);

        }
    }
    else {
        if (casillaAntes.figura.nombre !== "Caballo") {
            let rey = encontrarRey(casillaAntes.figura.tipo);
            let xAh = casillaAhora.x;
            let yAh = casillaAhora.y;
            let xAmenazante = casillaAntes.casillaAlmacenada.x;
            let yAmenazante = casillaAntes.casillaAlmacenada.y;

            let xDif = rey.x - xAmenazante;
            let yDif = rey.y - yAmenazante;

            if (xDif === 0) {
                for (let n = 0; n <= Math.abs(yDif) && xAh === rey.x; n++) {
                    if (rey.y > yAmenazante) {
                        if (rey.y - n == yAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                    }
                    else if (rey.y < yAmenazante) {
                        if (rey.y + n == yAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                    }

                }
            }
            else if (yDif === 0) {
                for (let n = 0; n <= Math.abs(xDif) && yAh === rey.y; n++) {
                    if (rey.x > xAmenazante) {
                        if (rey.x - n == xAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                    }
                    else if (rey.x < xAmenazante) {
                        if (rey.x + n == xAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                    }
                }
            }
            else if (Math.abs(xDif) === Math.abs(yDif)) {
                for (let n = 0; n <= Math.abs(yDif); n++) {
                    if (rey.x > xAmenazante) {
                        if (rey.x - n == xAh) {
                            if (rey.y > yAmenazante) {
                                if (rey.y - n == yAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                            }
                            else if (rey.y < yAmenazante) {
                                if (rey.y + n == yAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                            }
                        }
                    }
                    else if (rey.x < xAmenazante) {
                        if (rey.x + n == xAh) {
                            if (rey.y > yAmenazante) {
                                if (rey.y - n == yAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                            }
                            else if (rey.y < yAmenazante) {
                                if (rey.y + n == yAh) colorEvento(accion, casillaAntes, casillaAhora) //ACCION
                            }
                        }
                    }
                }
            }
        }
    }
    actualizarUno(casillaAhora);
}
//Lo uso dentro de movimientosColor
colorEvento = (accion, casillaAntes, casillaAhora) => {
    casillaAhora.CColor = accion ? accion !== "Enroque" ? 3 : 2 : 2;
    $(`#${casillaAhora.posCasilla}`).off();
    $(`#${casillaAhora.posCasilla}`).on("click", () => mover(casillaAntes.x, casillaAntes.y, casillaAhora.x, casillaAhora.y, accion));
}
encontrarRey = (color) => {
    for (let x = 0; x < tablero.casillas.length; x++) {
        for (let y = 0; y < tablero.casillas[x].length; y++) {
            if (tablero.casillas[x][y].figura.nombre == "Rey" && tablero.casillas[x][y].figura.tipo === color) {
                return tablero.casillas[x][y];
            }
        }
    }
}
cambiarTurno = () => {

    tablero.turno = nMovimientos % 2;
    let nombre = tablero.turno === 0 ? nombre1 : nombre2;
    document.getElementById("textoTurno").firstElementChild.textContent = "Turno de " + nombre;
}