const dao = require("./dao")

crearPartida = async(id_1, id_2) => {
    creacionPartida = await dao.crearPartida(id_1, id_2);
    return
}

partidaCreada = async (id_1, id_2) => {
    if(!id_1 || !id_2) return console.log("Los id's no llegaron correctamente");
    
    let creacionPartida = false;
    let partida = await dao.getPartidaPorIds(id_1, id_2);
    let jugador1 = await dao.getUsuarioPorId(id_1);
    let jugador2 = await dao.getUsuarioPorId(id_2);

    if (partida.rows.length==0){
        await crearPartida(id_1, id_2);
        partida = await dao.getPartidaPorIds(id_1, id_2);
        creacionPartida = true;
    }
    if(!jugador1 || !jugador2) return console.log("Los id's no perteneces a jugadores validos")

    return {partida, creacionPartida}

}
function comprobacion(id_1, id_2){
    return partidaCreada(id_1, id_2);
}

module.exports = comprobacion;