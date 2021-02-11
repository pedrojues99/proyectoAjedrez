let cambiarMenu = (tipo) => {
    switch (tipo) {
        case 0:
            inicio.display = "block";
            perfil.display = "none";
            historial.display = "none";
            break;
        case 1:
            inicio.display = "none";
            perfil.display = "block";
            historial.display = "none";
            break;
        case 2:
            inicio.display = "none";
            perfil.display = "none";
            historial.display = "block";
            break;
        default:
            inicio.display = "block";
            perfil.display = "none";
            historial.display = "none";
    }

}