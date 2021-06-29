const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

  try {

    // extraer el token
    const token = req.header('x-token');

    // comprobar si hay token
    if ( !token ) {
        return res.status(404).json({
          ok: false,
          msg: 'No hay token en la peticion'
        });
    }

    // verificar token
    const { uid } = jwt.verify( token , process.env.JWT_KEY );
    req.uid = uid;

    // res.json({
    //   ok: true,
    //   payload
    // });
    
    // enviamos el uid
    next();
    
  } catch (error) {
      res.status(401).json({
        ok:false,
        msg:'Token no es válido'
      });
  }

}


module.exports = {
  validarJWT
}