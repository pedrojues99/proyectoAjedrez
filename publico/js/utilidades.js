
function importarScript(nombre) {
    let s = document.createElement("script");
    s.src = nombre;
    document.querySelector("head").appendChild(s);
}
function crearArray (length) { //Metodo que he encontrado en Internet
    let arr = new Array(length || 0),
        i = length; //Almaceno en i la longitud de length que no se lo que da

    if (arguments.length > 1) { //con arguments.length obtienes la cantidad de argumentos que mandan por parametro por lo que si hay mas de 1 se llama a si mismo el metodo.
        let args = Array.prototype.slice.call(arguments, 1);
        while (i--) arr[i] = crearArray.apply(this, args);
    }
    return arr;
}