if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const path = require('path');
const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const comprobacion = require('./src/comprobaciones');
const dao = require('./src/dao.js');
require('./src/_inicializaciones');     //No hace nada aun
// Starting the server

const inicializarPassport = require('./passport-config.js');    //Inicio de sesion con esto
inicializarPassport(passport,
    email => dao.getUsuarioPorEmail(email),
    id => dao.getUsuarioPorId(id)
);


const app = express();


// settings
app.set('views', path.join(__dirname, 'publico'));
app.set('port', process.env.PORT || 3000);
app.set('view-engine', 'ejs');
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())

const server = app.listen(app.get('port'), () => {
    console.log('server on port', app.get('port'));
});

const SocketIO = require('socket.io');
const io = SocketIO.listen(server) //mantiene la conexion de sockets
//Direcciones
app.get('/', checkAuthenticated, async (req, res) => {
    try{ 
    let usuario = await req.user;
    res.cookie('id', usuario.id, {
        expires: new Date(Date.now() + (60 * 60 * 24 * 365 * 3))
    });
    let partidas = await dao.getPartidas(usuario.id);
    let contadorTotal = 0;
    let contadorVictorias = 0;

    for (let x = 0; x < partidas.rows.length; x++) {
        if (partidas.rows[x].ganador != null) {
            contadorTotal++;
            if (partidas.rows[x].ganador === usuario.id) {
                contadorVictorias++;
            }
        }
    }

    res.render('cliente/index.ejs', {
        nombre: usuario.nombre,
        id: usuario.id,
        contadorVictorias: contadorVictorias,
        contadorTotal: contadorTotal,
        partidas: partidas.rows
    });
}
catch {
    console.log("fallo id no encontrado");
}
})
app.post('/partida', async (req, res) => {
    const comprobar = await comprobacion(req.body.id_1, req.body.id_2);
    const partida = await comprobar.partida.rows[0];
    const jugador1 = await dao.getUsuarioPorId(partida.jugador1);
    const jugador2 = await dao.getUsuarioPorId(partida.jugador2);
    let codigoSala = jugador1.id + "-" + jugador2.id;

    res.render('cliente/ajedrez.ejs', {
        nombre_1: jugador1.nombre,
        id_1: jugador1.id,
        nombre_2: jugador2.nombre,
        id_2: jugador2.id,
        idPartida: partida.id,
        id: req.cookies['id'],
        posicion: partida.posicion,
        movimiento: partida.movimientos,
        codigoSala: codigoSala
    });
})
app.get('/partida', async (req, res) => {

    res.redirect("/")
})
app.get('/login', (req, res) => {
    res.render('cliente/login.ejs');

})
app.get('/registrar', (req, res) => {
    res.render('cliente/registrar.ejs');
})

app.post('/registrar', async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        usuario = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        };


        if (await dao.setUsuario(usuario.name, usuario.email, usuario.password)) {
            res.redirect('/login');
        }
        else {
            res.send("<script> volver = () => window.location.href = window.location.href; </script>Ya hay un usuario con ese email, pruebe a usar otro       <button onclick=volver()>Volver</button>");
            
            
        }
    }
    catch {
        res.redirect('/registrar');
    }
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

// Global variables

// Routes
console.log(path.join(__dirname, 'publico')); //Te devuelve la ruta en la que estas por consola y añade lo que este en path.join, se encarga de poner las / correspondientes a la iso.
app.use(express.static(path.join(__dirname, 'publico')));

// Public

// websockets

io.on('connection', (socket) => {

    socket.on('usuario: connection', ({ id }) => {
        socket.join(id);
    })
    socket.on('chatGlobal: message', ({ ...data }) => {
        io.emit('chatGlobal: message', data)
    });
    socket.on("invitacionPartida", async ({ id, id2 }) => {
        if (!id2 || !id) {
            console.log("id's iguales")
        }
        let consultaUsuario = await dao.getUsuarioPorId(id)
        let usuario = {
            id: id,
            nombre: consultaUsuario.nombre
        }
        io.to(id2).emit("invitacionPartida", usuario)


    })

    socket.on('partida: connection', ({ codigoSala }) => {
        socket.join(codigoSala);
    })
    socket.on('chatAjedrez: message', ({ codigoSala, ...data }) => {
        io.to(codigoSala).emit('chatAjedrez: message', data)
    });
    socket.on('chatAjedrez: typing', ({ codigoSala, ...data }) => {
        socket.to(codigoSala).emit('chatAjedrez: typing', data);
    });

    socket.on('ajedrez: movimiento', ({ idPartida, movimiento, posicion, codigoSala, ...variables }) => {
        movimiento++;
        dao.actualizarPartidaPorId(idPartida, movimiento, posicion, true)
        variables.movimiento = movimiento;
        variables.posicionC = posicion;
        io.to(codigoSala).emit('ajedrez: movimiento', variables);
    });

    socket.on('ajedrez: finalizarPartida', ({ idPartida, movimiento, posicion, codigoSala, ganador, ...variables }) => {
        dao.actualizarPartidaPorId(idPartida, movimiento, posicion, false, ganador)
        variables.ganador = ganador;
        io.to(codigoSala).emit('ajedrez: finalizarPartida', variables);
    });
})