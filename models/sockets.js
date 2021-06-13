const BandList = require('./band-list');


class Sockets {

  constructor(io){

    this.io = io;

    // Bands
    this.bandList = new BandList;

    // Llamamos nuestro socketEvent
    this.socketEvents();

  }

  // Eventos de comunicación de sockets

  socketEvents(){
    // On connection  
    this.io.on('connection', ( socket ) => {
      // console.log('cliente conectado !!!');

      // Escuchamos evento mensaje-cliente 
      socket.on('mensaje-to-server', (data) => {
        console.log(data);
        // Notificamos el mensaje que estamos recibiendo (data)
        // socket.emit('mensaje-from-server', data);
        // Envió de mensaje global con io : io emite a todos
        this.io.emit('mensaje-from-server', data);
      });

    // Primer evento de sockets - emitir al cliente conectado todas las bandas actuales
    socket.emit('current-bands', this.bandList.getBand() );

    // Votar por la banda
    socket.on('votar-banda', ( id ) => {
      // incremento los votos
      this.bandList.increaseVotes(id);
      // actualizo información
      this.io.emit('current-bands', this.bandList.getBand());
    });
    // Votar por la banda
    socket.on('descontar-banda', ( id ) => {
      // decremento de los votos
      this.bandList.decreaseVotes(id);
      // actualizo información
      this.io.emit('current-bands', this.bandList.getBand());
    });

    // Borrar banda
    socket.on('borrar-banda', (id)=>{
        console.log(id)
        this.bandList.removeBand(id);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
    });
    // Cambiar nombre de anda
      socket.on('cambiar-nombre-banda', ({id, nombre })=>{
        this.bandList.changeName(id,nombre);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
    });

    // Agregar Banda
      socket.on('agregar-banda', ({nombre})=>{
        console.log(nombre)
        this.bandList.addBand(nombre);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
    });




    });
  }

}


module.exports = Sockets;