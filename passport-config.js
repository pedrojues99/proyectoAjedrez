const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

function inicializar(passport, getUsuarioPorEmail, getUsuarioPorId){
    const authenticateUser = async(email, contrasenna, done) => {
        const usuario = await getUsuarioPorEmail(email);
        if(usuario == null){
            return done(null, false, { message: 'No hay usuario con ese email'})
        }
        try{
            if (await bcrypt.compare(contrasenna, usuario.contrasenna)){
                return done(null, {nombre: usuario.nombre,
                id: usuario.id
                })
            }
            else{
                    return done(null, false, { message: 'Contraseña incorrecta'})
            }
        }
        catch (e) {
            return done(e);
        }
    }
    passport.use(new LocalStrategy({ usernameField: 'email'},
        authenticateUser))
    passport.serializeUser((usuario, done) => {
    done(null, usuario.id)
    });

    passport.deserializeUser((id, done) => {
        done(null, getUsuarioPorId(id))
    });
}

module.exports = inicializar;