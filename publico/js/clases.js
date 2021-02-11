function Movimiento(casillaAnterior, casillaAhora) {
    this.casillaAnterior = casillaAnterior;
    this.casillaAhora = casillaAhora;
    this.accion;
    this.cadenaTexto;

    this.comprobarAccion = function () {
        if (this.casillaAhora.figura) {
            this.accion = "X";
        }
        else {
            this.accion = "";
        }
    }
    this.ponerMovimiento = function () {
        let conversor = ["A", "B", "C", "D", "E", "F", "G", "H"];
        let p = document.createElement("p");
        let img = document.createElement("img");
        let imgFCaida = document.createElement("img");
        img.setAttribute("src", this.casillaAnterior.figura.imagen);
        if (this.casillaAhora.figura.imagen) {

            imgFCaida.setAttribute("src", this.casillaAhora.figura.imagen);
            imgFCaida.style.height = "30px";
            imgFCaida.style.width = "26px";
            imgFCaida.style.marginRight = "10px";
        }
        img.style.height = "30px";
        img.style.width = "26px";
        img.style.margin = "0px 10px";

        this.cadenaTexto = document.createTextNode(`${this.casillaAnterior.figura.nombre.split("")[0].toUpperCase()} ${conversor[this.casillaAhora.x]}${this.casillaAhora.y} ${this.accion}`);
        p.style.marginLeft = "10px";
        p.style.width = "fit-content";
        p.appendChild(img);
        p.appendChild(this.cadenaTexto);

        if (this.casillaAhora.figura.imagen) {
            p.style.backgroundColor = "#b44";
            p.appendChild(imgFCaida);
        }
        document.getElementById("historial-window").appendChild(p);
    }
    this.comprobarAccion();
    this.ponerMovimiento();
}
const Figura = {
    estado: 1,
    mostrar: function (accion) {
        //ponerNormalTotalSinAzul();
        if (!tablero.turno && this.tipo == "Blanco") {
            this.posiblesMovimientos(accion);
        } else if (tablero.turno && this.tipo == "Negro") {
            this.posiblesMovimientos(accion);
        }
    }
}

function Casilla(x, y) {
    this.x = x;
    this.y = y;
    this.posCasilla = ((x * 8) + y);
    this.CColor = ((x + y) % 2) ? 0 : 1; //0 = negro, 1 = blanco, 2 = verde, 3 = rojo, 4 = azul
    this.casillaAmenazada = false;
    this.casillaAlmacenada = false;
    this.boton = document.getElementById(this.posCasilla);
    this.figura;

    this.ponerFigura = () => {
        switch (posicion.split("")[this.posCasilla]) {
            case '0':
                this.figura = false;
                break;
            case '1':
                this.figura = new Peon("Blanco", this);
                break;
            case '2':
                this.figura = new Torre("Blanco", this, false);
                break;
            case '3':
                this.figura = new Caballo("Blanco", this);
                break;
            case '4':
                this.figura = new Alfil("Blanco", this);
                break;
            case '5':
                this.figura = new Dama("Blanco", this);
                break;
            case '6':
                this.figura = new Rey("Blanco", this, false);
                break;
            case '7':
                this.figura = new Peon("Negro", this);
                break;
            case '8':
                this.figura = new Torre("Negro", this, false);
                break;
            case '9':
                this.figura = new Caballo("Negro", this);
                break;
            case 'A':
                this.figura = new Alfil("Negro", this);
                break;
            case 'B':
                this.figura = new Dama("Negro", this);
                break;
            case 'C':
                this.figura = new Rey("Negro", this, false);
                break;
            case 'D':
                this.figura = new Rey("Blanco", this, true);
                break;
            case 'E':
                this.figura = new Rey("Negro", this, true);
                break;
            case 'F':
                this.figura = new Torre("Blanco", this, true);
                break;
            case 'G':
                this.figura = new Torre("Negro", this, true);
                break;

        }
        if (this.figura) this.figura.id = this.posCasilla;
        this.ponerQuitarImagen();

    }

    this.getImagen = () => {
        if (this.figura) {
            var img = document.createElement("img");
            img.setAttribute("src", this.figura.imagen);
            return img;
        }
        else console.log("No hay figura en esta casilla");
    }
    this.ponerQuitarImagen = () => {
        try {
            this.boton.childNodes[0].remove();
        }
        catch {

        }
        if (this.figura) {
            this.boton.appendChild(this.getImagen());

        }

    }

    this.ponerFigura();


}

function Tablero(idTablero) {
    this.id = idTablero;
    this.turno = nMovimientos % 2;
    this.casillas = crearArray(8, 8);
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            this.casillas[x][y] = new Casilla(x, y);
        }
    }
}



function codigoPosiblesMovimientos(casilla, figura, accion, colision = "no bucle") {
    if (accion == "mostrar") {
        if (!casilla.figura) {

            movimientosColor(figura.casilla, casilla, 0);
        }
        else {
            if (colision != null) colision = false;
            if (casilla.figura.tipo != figura.tipo) {
                movimientosColor(figura.casilla, casilla, 1);
            }
        }
    }
    else if (accion === "amenaza") {
        if (typeof colision !== "object" && colision != null || colision === "no bucle") {
            casilla.casillaAmenazada ? casilla.casillaAmenazada += `-${figura.casilla.x}${figura.casilla.y}` : casilla.casillaAmenazada = `${figura.casilla.x}${figura.casilla.y}`;
        }
        if (casilla.figura) {
            if (casilla.figura.nombre === "Rey") {

                if (typeof colision === "object" && colision != null) {

                    if (figura.tipo != colision.figura.tipo) {
                        colision.CColor = 4;
                        colision.casillaAlmacenada = figura.casilla;
                        actualizarUno(colision);
                        colision = false;
                        return colision;
                    }
                }
                else {
                    colision = true;
                }

            }

            colision === true ? casilla.figura.nombre !== "Rey" ? colision = casilla : colision = true : colision = false;
        }
    }
    else if (accion === "CVictoria") {

        return false;
    }
    return colision;
}

function Alfil(tipo, casilla) {
    this.casilla = casilla;
    this.nombre = "Alfil";
    this.tipo = tipo;
    if (this.tipo == "Blanco") {
        this.imagen = src + "BAlfil.png";
    } else if (this.tipo = "Negro") {
        this.imagen = src + "NAlfil.png";
    }
    this.posiblesMovimientos = (accion) => {
        let colision = true;
        let casillas = tablero.casillas;
        let x = this.casilla.x;
        let y = this.casilla.y;

        for (let n = 1; x + n < 8 && y + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x + n][y + n], this, accion, colision);

        for (let n = 1, colision = true; x + n < 8 && y - n > -1 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x + n][y - n], this, accion, colision)

        for (let n = 1, colision = true; x - n > -1 && y + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x - n][y + n], this, accion, colision)

        for (let n = 1, colision = true; x - n > -1 && y - n > -1 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x - n][y - n], this, accion, colision)
    }
}

function Rey(tipo, casilla, movido) {
    this.casilla = casilla;
    this.nombre = "Rey";
    this.tipo = tipo;
    if (this.tipo == "Blanco") {
        this.imagen = src + "BRey.png";
    } else if (this.tipo = "Negro") {
        this.imagen = src + "NRey.png";
    }
    this.movido = movido;
    this.posiblesMovimientos = (accion) => {
        let casillas = tablero.casillas;
        let x = this.casilla.x;
        let y = this.casilla.y;
        let partidaAcabada = true;

        if (x + 1 < 8 && !casillas[x + 1][y].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x + 1][y], this, accion) : codigoPosiblesMovimientos(casillas[x + 1][y], this, accion);

        if (x - 1 >= 0 && !casillas[x - 1][y].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x - 1][y], this, accion) : codigoPosiblesMovimientos(casillas[x - 1][y], this, accion);

        if (y + 1 < 8 && !casillas[x][y + 1].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x][y + 1], this, accion) : codigoPosiblesMovimientos(casillas[x][y + 1], this, accion);

        if (y - 1 >= 0 && !casillas[x][y - 1].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x][y - 1], this, accion) : codigoPosiblesMovimientos(casillas[x][y - 1], this, accion);

        if (x + 1 < 8 && y + 1 < 8 && !casillas[x + 1][y + 1].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x + 1][y + 1], this, accion) : codigoPosiblesMovimientos(casillas[x + 1][y + 1], this, accion);

        if (x + 1 < 8 && y - 1 > -1 && !casillas[x + 1][y - 1].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x + 1][y - 1], this, accion) : codigoPosiblesMovimientos(casillas[x + 1][y - 1], this, accion);

        if (x - 1 > -1 && y + 1 < 8 && !casillas[x - 1][y + 1].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x - 1][y + 1], this, accion) : codigoPosiblesMovimientos(casillas[x - 1][y + 1], this, accion);

        if (x - 1 > -1 && y - 1 > -1 && !casillas[x - 1][y - 1].casillaAmenazada) accion === "CVictoria" ? partidaAcabada = codigoPosiblesMovimientos(casillas[x - 1][y - 1], this, accion) : codigoPosiblesMovimientos(casillas[x - 1][y - 1], this, accion);

        if (accion === "CVictoria") {
            return partidaAcabada;
        }
        if (!this.movido && accion === "mostrar" && this.casilla.CColor !== 5) {
            if (!casillas[x][y - 1].figura && !casillas[x][y - 2].figura && !casillas[x][y - 3].figura && casillas[x][y - 4].figura.nombre === "Torre" && casillas[x][y - 4].figura.movido === false && !casillas[x][y - 2].casillaAmenazada && !this.casillaAmenazada) {
                movimientosColor(this.casilla, casillas[x][y - 2], "Enroque");
            }
            if (!casillas[x][y + 1].figura && !casillas[x][y + 2].figura && casillas[x][y + 3].figura.nombre === "Torre" && casillas[x][y + 3].figura.movido === false && !casillas[x][y + 2].casillaAmenazada && !this.casillaAmenazada) {
                movimientosColor(this.casilla, casillas[x][y + 2], "Enroque");
            }

        }
    }
}

function Dama(tipo, casilla) {
    this.casilla = casilla;
    this.nombre = "Dama";
    this.tipo = tipo;
    if (this.tipo == "Blanco") {
        this.imagen = src + "BDama.png";
    } else if (this.tipo = "Negro") {
        this.imagen = src + "NDama.png";
    }
    this.posiblesMovimientos = (accion) => {
        let colision = true;
        let casillas = tablero.casillas;
        let x = this.casilla.x;
        let y = this.casilla.y;

        for (let n = 1; x + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x + n][y], this, accion, colision);

        for (let n = 1, colision = true; x - n >= 0 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x - n][y], this, accion, colision);

        for (let n = 1, colision = true; y + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x][y + n], this, accion, colision);

        for (let n = 1, colision = true; y - n >= 0 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x][y - n], this, accion, colision);

        for (let n = 1, colision = true; x + n < 8 && y + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x + n][y + n], this, accion, colision);

        for (let n = 1, colision = true; x + n < 8 && y - n > -1 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x + n][y - n], this, accion, colision)

        for (let n = 1, colision = true; x - n > -1 && y + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x - n][y + n], this, accion, colision)

        for (let n = 1, colision = true; x - n > -1 && y - n > -1 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x - n][y - n], this, accion, colision)
    }
}

function Torre(tipo, casilla, movido) {
    this.casilla = casilla;
    this.nombre = "Torre";
    this.tipo = tipo;
    this.movido = movido;
    if (this.tipo == "Blanco") {
        this.imagen = src + "BTorre.png";
    } else if (this.tipo = "Negro") {
        this.imagen = src + "NTorre.png";
    }
    this.posiblesMovimientos = (accion) => {
        let colision = true;
        let casillas = tablero.casillas;
        let x = this.casilla.x;
        let y = this.casilla.y;

        for (let n = 1; x + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x + n][y], this, accion, colision);

        for (let n = 1, colision = true; x - n >= 0 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x - n][y], this, accion, colision);

        for (let n = 1, colision = true; y + n < 8 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x][y + n], this, accion, colision);

        for (let n = 1, colision = true; y - n >= 0 && colision; n++) colision = codigoPosiblesMovimientos(casillas[x][y - n], this, accion, colision);
    }
}


function Peon(tipo, casilla) {
    this.casilla = casilla;
    this.nombre = "Peon";
    this.tipo = tipo;
    if (this.tipo == "Blanco") {
        this.imagen = src + "BPeon.png";
    } else if (this.tipo = "Negro") {
        this.imagen = src + "NPeon.png";
    }
    this.cambiarFigura = function () {
        switch (parseInt(prompt("1. Dama\n2. Caballo\n3. Torre\n4. Alfil"))) {
            case 1:
                return this.tipo === "Blanco" ? "5" : "B";

            case 2:
                return this.tipo === "Blanco" ? "3" : "9";

            case 3:
                return this.tipo === "Blanco" ? "F" : "G";

            case 4:
                return this.tipo === "Blanco" ? "4" : "A";

            default:
                this.cambiarFigura();
        }
    }
    this.posiblesMovimientos = (accion) => {
        let colision = false;
        let casillas = tablero.casillas;
        let x = this.casilla.x;
        let y = this.casilla.y;

        if (this.tipo == "Blanco") {
            if (x + 1 < 8) {
                if (!casillas[x + 1][y].figura && accion == "mostrar") movimientosColor(this.casilla, casillas[x + 1][y], 0);
                else colision = true;

                if (x == 1 && accion == "mostrar") if (!casillas[x + 2][y].figura && !colision) movimientosColor(this.casilla, casillas[x + 2][y], 0);

                if (y - 1 > -1) {
                    if (accion == "mostrar") {
                        if (casillas[x + 1][y - 1].figura.tipo != this.tipo && casillas[x + 1][y - 1].figura) movimientosColor(this.casilla, casillas[x + 1][y - 1], 1);
                    }
                    else if (accion == "amenaza") casillas[x + 1][y - 1].casillaAmenazada ? casillas[x + 1][y - 1].casillaAmenazada += `-${x}${y}` : casillas[x + 1][y - 1].casillaAmenazada = `${x}${y}`;
                }
                if (y + 1 < 8) {
                    if (accion == "mostrar") {
                        if (casillas[x + 1][y + 1].figura.tipo != this.tipo && casillas[x + 1][y + 1].figura) movimientosColor(this.casilla, casillas[x + 1][y + 1], 1);
                    }
                    else if (accion == "amenaza") casillas[x + 1][y + 1].casillaAmenazada ? casillas[x + 1][y + 1].casillaAmenazada += `-${x}${y}` : casillas[x + 1][y + 1].casillaAmenazada = `${x}${y}`;
                }
            }

        }
        else {
            if (x - 1 > -1) {

                if (!casillas[x - 1][y].figura && accion == "mostrar") movimientosColor(this.casilla, casillas[x - 1][y], 0);
                else colision = true;

                if (x == 6 && accion == "mostrar") if (!casillas[x - 2][y].figura && !colision) movimientosColor(this.casilla, casillas[x - 2][y], 0);

                if (y - 1 > -1) {
                    if (casillas[x - 1][y - 1].figura && casillas[x - 1][y - 1].figura.tipo != this.tipo) {
                        if (accion == "mostrar") movimientosColor(this.casilla, casillas[x - 1][y - 1], 1);
                    }
                    else if (accion == "amenaza") casillas[x - 1][y - 1].casillaAmenazada ? casillas[x - 1][y - 1].casillaAmenazada += `-${x}${y}` : casillas[x - 1][y - 1].casillaAmenazada = `${x}${y}`;
                }

                if (y + 1 < 8) {
                    if (accion == "mostrar") {
                        if (casillas[x - 1][y + 1].figura && casillas[x - 1][y + 1].figura.tipo != this.tipo) movimientosColor(this.casilla, casillas[x - 1][y + 1], 1);
                    }
                    else if (accion == "amenaza") casillas[x - 1][y + 1].casillaAmenazada ? casillas[x - 1][y + 1].casillaAmenazada += `-${x}${y}` : casillas[x - 1][y + 1].casillaAmenazada = `${x}${y}`;

                }
            }
        }
    }
}

//COMPROBACION EN MOSTRAR
function Caballo(tipo, casilla) {
    this.casilla = casilla;
    this.nombre = "Caballo";
    this.tipo = tipo;
    if (this.tipo == "Blanco") {
        this.imagen = src + "BCaballo.png";
    } else if (this.tipo = "Negro") {
        this.imagen = src + "NCaballo.png";
    }
    this.posiblesMovimientos = (accion) => {
        let casillas = tablero.casillas;
        let x = this.casilla.x;
        let y = this.casilla.y;

        if (x + 1 < 8 && y + 2 < 8) codigoPosiblesMovimientos(casillas[x + 1][y + 2], this, accion);

        if (x + 1 < 8 && y - 2 > -1) codigoPosiblesMovimientos(casillas[x + 1][y - 2], this, accion)

        if (x - 1 > -1 && y + 2 < 8) codigoPosiblesMovimientos(casillas[x - 1][y + 2], this, accion)

        if (x - 1 > -1 && y - 2 > -1) codigoPosiblesMovimientos(casillas[x - 1][y - 2], this, accion)

        if (x + 2 < 8 && y + 1 < 8) codigoPosiblesMovimientos(casillas[x + 2][y + 1], this, accion);

        if (x + 2 < 8 && y - 1 > -1) codigoPosiblesMovimientos(casillas[x + 2][y - 1], this, accion)

        if (x - 2 > -1 && y + 1 < 8) codigoPosiblesMovimientos(casillas[x - 2][y + 1], this, accion)

        if (x - 2 > -1 && y - 1 > -1) codigoPosiblesMovimientos(casillas[x - 2][y - 1], this, accion)
    }
}