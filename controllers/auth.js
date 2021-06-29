const { response } = require('express');
const Usuario = require('../models/chat/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

  try {

    const { email, password} = req.body;

    // ultilizaremos nuestro model Usuario

    // verificar que el email no exista
    const existeEmail =  await Usuario.findOne({email});

    if(existeEmail){
        return res.status(404).json({
          ok: true,
          msg:'El correo ya existe'
        });
    }
    
    // Instanciamos el usuario
    const usuario = new Usuario(req.body);

    // Encriptar la constraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync( password, salt );


    // Guardar usuario en base de datos
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT( usuario.id );


    res.json({
      usuario,
      token,
    })


    
  } catch (error) {
    
    res.status(500).json({
      ok:false,
      msg:'Hable con el administrador'
    });
  }
 
};


const login = async(req, res ) => {

  // obtengo el parseo del body
  const { email, password } = req.body;

  try {
    
    const usuarioDB = await Usuario.findOne({email});

    // verificar si el correo existe
    if (!usuarioDB) {
        return res.status(404).json({
          ok:false,
          msg:'Email no encontrado', /* solo para efecto de pruebas , lo recomendable no es dar pistas al usuario */
        })
    }

    // validar password - bcrypt ( password , paswrod encriptada )
    const validPassword = bcrypt.compareSync( password, usuarioDB.password );
    if (!validPassword){
        return res.status(404).json({
          ok:false,
          msg: 'El password no es correcto', /* solo para efecto de pruebas , lo recomendable no es dar pistas al usuario */
        })
    }

    // Generar el JWT
    const token = await generarJWT( usuarioDB.id );

    res.json({
      ok:true,
      usuario: usuarioDB,
      token
    });

  } catch (error) {

    res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });

  }
  
};


const renewToken = async(req, res ) => {

  const uid = req.uid;

  // Generamos un nuevo JWR con nuestro uid
  const token = await generarJWT( uid );

  // Obtener el usuario por uid
  const usuario = await Usuario.findById( uid );
  

  res.json({
    ok: true,
    token,
    usuario
  });

};












module.exports = {
  crearUsuario,
  login,
  renewToken
}











/**
 * Los controladores no son más que funciones simples y corrientes
 */