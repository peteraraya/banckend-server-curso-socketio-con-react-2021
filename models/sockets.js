

class Sockets {

  constructor(io){

    this.io = io;

    // Llamamos nuestro socketEvent
    this.socketEvents();

  }

  // Eventos de comunicación de sockets

  socketEvents(){
    // On connection  
    this.io.on('connection', ( socket ) => {

      // Escuchamos evento mensaje-cliente
      socket.on('mensaje-to-server', (data) => {
        console.log(data);
        // Envió de mensaje global con io : io emite a todos
        this.io.emit('mensaje-from-server',data);
      });



    });
  }

}


module.exports = Sockets;