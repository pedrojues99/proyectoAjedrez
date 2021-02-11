const { Pool } = require('pg');
//Base de datos pg
const connectionData = {
    user: 'postgres',
    host: '',
    database: 'ajedrez',
    password: '1234',
    port: 5432
}
const pool = new Pool(connectionData);
// metodos
/*
var MetodosUsuarios = {
    getUsuarios: async() => {
        try{
            return usuarios = await pool.query('select * from usuarios;');

        }
        catch (e) {
            console.log(e);
        }
    },
    setUsuario: async(nombre, correo, contrasenna) => {

        try{
            await pool.query(`INSERT INTO usuarios values ('${nombre}', '${correo}', '${contrasenna}')`) //Error de que tngo que meter id F.
        }
        catch (e) {
            console.log(e)
        }


    }
}

 */
exports.getUsuarios = async () => {
    try {
        return await pool.query('select * from usuarios;');

    }
    catch (e) {
        console.log(e);
    }
}

exports.setUsuario = async (nombre, email, contrasenna) => {

    try {
        if (!await this.getUsuarioPorEmail(email)) {
            await pool.query(`INSERT INTO usuarios(nombre, email, contrasenna) values ('${nombre}', '${email}', '${contrasenna}')`);
            return true;
        }
        else{
            return false;
        }
    }
    catch (e) {
        console.log(e)
    }
}
exports.getUsuarioPorEmail = async (email) => {
    try {
        let usuario = await pool.query(`select * from usuarios where email='${email}';`);
        return usuario.rows[0];
    }
    catch (e) {
        console.log(e);
    }
}

exports.getUsuarioPorId = async (id) => {
    try {
        let usuario = await pool.query(`select * from usuarios where id=${id};`);
        return usuario.rows[0];
    }
    catch (e) {
        console.log(e);
    }
}

//Partidas
exports.getPartidas = async (id) => {
    try {
        return await pool.query(`select * from partidas where jugador1 = ${id} and ganador is not null or jugador2 = ${id}  and ganador is not null`);

    }
    catch (e) {
        console.log(e);
    }
}
exports.getPartidasPorIdJugador = async (id) => {
    try {
        return await pool.query(`select * from partidas where jugador1=${id} OR jugador2=${id};`);


    }
    catch (e) {
        console.log(e);
    }
}
exports.crearPartida = async (id1, id2) => {
    try {
        return await pool.query(`INSERT INTO partidas(jugador1, jugador2, movimientos, posicion, estado) values ('${id1}', '${id2}', '0', '2345643211111111000000000000000000000000000000007777777789ABCA98', true)`)

    }
    catch (e) {
        console.log(e)
    }
}
exports.getPartidaPorIds = async (id1, id2) => {
    try {
        console.log("hola")
        return await pool.query(`select * from partidas where jugador1=${id1} AND jugador2=${id2} AND estado = true OR jugador1=${id2} AND jugador2=${id1} AND estado=true;`);
    }
    catch (e) {
        console.log(e);
    }
}
exports.actualizarPartidaPorId = async (id, nMovimiento, posicion, estado, ganador = null) => {
    try {
        return await pool.query(`update partidas set movimientos = '${nMovimiento}', posicion = '${posicion}', estado=${estado}, ganador=${ganador} where id=${id};`);
    }
    catch (e) {
        console.log(e);
    }
}