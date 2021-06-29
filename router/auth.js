/**
 *  path : api/login
 */

// nos va permitir establecer las rutas
const { Router } = require('express');
const { check } = require('express-validator');

// controllers
const { crearUsuario, renewToken, login } = require('../controllers/auth');

// middlewares
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Definción de endpoints

// Crear Usuario
router.post('/new',[
   // middleware - express-validator
  check('nombre', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password es obligatorio').not().isEmpty(),
  check('email', 'El email es obligatorio').isEmail(),
  validarCampos
], crearUsuario);

// Login
router.post('/',[ 
  // middleware - express-validator
  check('email','El email es obligatorio').isEmail(),
  check('password','El password es obligatorio').not().isEmpty(),
  validarCampos
],login );

// Revalidar Token
router.post('/renew',[ validarJWT ], renewToken );



module.exports = router;

/***
 *  Las rutas tienen 3 argumentos - el segundo argumento sirve para enviar middlewares
 */