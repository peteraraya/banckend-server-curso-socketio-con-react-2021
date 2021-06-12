// Servidor de express
const express = require('express');
const app = express();

// Servidor de sockets
const server = require('http').createServer(app);

// Configuración del socket server
const io = require('socket.io')(server);

// Desplegar el directorio público
app.use(express.static(__dirname + '/public'));


io.on('connection', (socket) => {
  // console.log(socket.id);

  // Emitimos evento mensaje-bienvenida
  // socket.emit('mensaje-bienvenida', {
  //     msg:'Bienvenido al server',
  //     fecha: new Date()
  // });

  // Escuchamos evento mensaje-cliente
  socket.on('mensaje-to-server', (data) => {
    console.log(data);
    
    // Notificamos el mensaje que estamos recibiendo (data)
    // socket.emit('mensaje-from-server', data);

    // Envió de mensaje global con io : io emite a todos
    io.emit('mensaje-from-server',data);

  });

});


server.listen(8080, ()=>{
  console.log('Server corriendo en puerto 8080');
});