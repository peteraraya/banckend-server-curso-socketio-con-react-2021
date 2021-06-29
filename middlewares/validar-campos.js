const { validationResult } = require("express-validator");

const validarCampos = ( req, res, next) =>{

  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    return res.status(404).json({
      ok: false,
      errors: errores.mapped()
    })
  }

  // si todo sale bien llamamos al next()
  next();



}




module.exports = {
  validarCampos
}