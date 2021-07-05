const Usuario = require('../models/chat/usuario');
const Mensaje = require('../models/chat/mensaje');



const usuarioConectado = async(uid) => {

  const usuario = await Usuario.findById(uid);
  usuario.online  = true;

  await usuario.save();

  return usuario;

}

const usuarioDesconectado = async(uid) => {
  const usuario = await Usuario.findById(uid);
  usuario.online = false;

  await usuario.save();

  return usuario;
}

// Mostar lista de usuarios
const getUsuarios = async() =>{

 const usuarios =  await Usuario
                            .find()
                            .sort('-online');

 return usuarios;
}


const grabarMensaje = async( payload ) => {
  try {
    const mensaje = new Mensaje(payload);
    await mensaje.save();

    return mensaje;
    
  } catch (error) {
      console.log(error);
      return false;
  }
}



module.exports = {
  usuarioConectado,
  usuarioDesconectado,
  getUsuarios,
  grabarMensaje
}