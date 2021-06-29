

const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({

  nombre:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  online: {
    type: Boolean,
    required: false,
  },


});

// Serializar el usuario para no mandar el password
UsuarioSchema.method('ToJSON', function (){

  const { __v, _id, password, ...object  } = this.toObject();

  object.uid  = _id;

  return object;

});
// monngoose --> lo coloca en plural el nombre del modelo
module.exports = model( 'Usuario', UsuarioSchema );