

const { Schema, model } = require('mongoose');

const MensajeSchema = Schema({

  de: {
    type: Schema.Types.ObjectId, // referencia
    ref: 'Usuario',
    required:true,
  },
  para: {
    type: Schema.Types.ObjectId, // referencia
    ref: 'Usuario',
    required:true,
  },
  mensaje: {
    type: String,
    required:true,
  },
  
  
},{
  timestamps : true // agrega fechas de creación y de última modificación
});

// Serializar el usuario para no mandar el password
MensajeSchema.method('ToJSON', function () {

  const { __v, ...object } = this.toObject();

  return object;

});
// monngoose --> lo coloca en plural el nombre del modelo
module.exports = model('Mensaje', MensajeSchema);