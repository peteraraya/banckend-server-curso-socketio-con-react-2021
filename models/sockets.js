const BandList = require('./bands/band-list');
const Marcadores = require('./marcadores/marcadores');
const TicketList = require('./tickets/ticket-list');
const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, getUsuarios, grabarMensaje } = require('../controllers/sockets');


class Sockets {

  constructor(io) {

    this.io = io;

    // Bands
    this.bandList = new BandList;

    // Crear instancia de nuestro ticket-list
    this.ticketList = new TicketList();

    // Marcadores
    this.marcadores = new Marcadores();


    // Llamamos nuestro socketEvent
    this.socketEvents();

  }

  // Eventos de comunicación de sockets

  socketEvents() {
    // On connection  
    this.io.on('connection', async (socket) => {
      // console.log('cliente conectado !!!');

      // Escuchamos evento mensaje-cliente 
      socket.on('mensaje-to-server', (data) => {
        // console.log(data);
        // Notificamos el mensaje que estamos recibiendo (data)
        // socket.emit('mensaje-from-server', data);
        // Envió de mensaje global con io : io emite a todos
        this.io.emit('mensaje-from-server', data);
      });

      // Primer evento de sockets - emitir al cliente conectado todas las bandas actuales
      socket.emit('current-bands', this.bandList.getBand());

      /***************************
       * BANDNAMES SOCKETS
       ***************************
       */

      // Votar por la banda
      socket.on('votar-banda', (id) => {
        // incremento los votos
        this.bandList.increaseVotes(id);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
      });

      // Votar por la banda
      socket.on('descontar-banda', (id) => {
        // decremento de los votos
        this.bandList.decreaseVotes(id);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
      });

      // Borrar banda
      socket.on('borrar-banda', (id) => {
        // console.log(id);
        this.bandList.removeBand(id);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
      });

      // Cambiar nombre de anda
      socket.on('cambiar-nombre-banda', ({ id, nombre }) => {
        this.bandList.changeName(id, nombre);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
      });

      // Agregar Banda
      socket.on('agregar-banda', ({ nombre }) => {
        // console.log(nombre);
        this.bandList.addBand(nombre);
        // actualizo información
        this.io.emit('current-bands', this.bandList.getBand());
      });

      /**********************
       *  TICKET  SOCKETS
       **********************
       */

      socket.on('solicitar-ticket', (data, callback) => {

        const nuevoTicket = this.ticketList.crearTicket();
        // console.log(nuevoTicket)
        callback(nuevoTicket);
      });


      // socket para siguienteTicket
      socket.on('siguiente-ticket-trabajar', ({ agente, escritorio }, callback) => {

        const suTicket = this.ticketList.asignarTicket(agente, escritorio);
        callback(suTicket);

        this.io.emit('ticket-asignado', this.ticketList.ultimos13);

      });

      /*************************
       *  MARCADORES SOCKETS
      **************************
      */

      // marcadores-activos
      socket.emit('marcadores-activos', this.marcadores.activos);

      // marcador-nuevo
      socket.on('marcador-nuevo', (marcador) => {
        // console.log('marcador-nuevo', marcador);
        this.marcadores.agregarMarcador(marcador);
        // emitimos un brodcast a todos los demas clientes ( lo muestra a todos menos al que lo emitio )
        socket.broadcast.emit('marcador-nuevo', marcador);

      });

      // marcador-actualizado
      socket.on('marcador-actualizado', (marcador) => {

        this.marcadores.actualizarMarcador(marcador);
        socket.broadcast.emit('marcador-actualizado', marcador);

      });

      /*************************
        *  CHAT SOCKETS
      **************************
      */
      const [valido, uid] = comprobarJWT(socket.handshake.query['x-token']);

      // validar token
      // si el token no es valido desconectarlo

      if (!valido) {
        console.log('Socket no identificado');
        return socket.disconnect();
      }

      // saber que usuario está activo mediante el uid
      await usuarioConectado(uid);

      // emitir todos los usuarios conectados
      this.io.emit('lista-usuarios', await getUsuarios());

      // Socket join --> para conectar a una sala 
      // unir el usuario a una sala de chat ( socket-io )
      socket.join(uid);

      // escuchar cuando el cliente manda un mensaje personalizada
      socket.on('mensaje-personal', async (payload) => {
        const mensaje = await grabarMensaje(payload);
        this.io.to( payload.para ).emit('mensaje-personal', mensaje );
        this.io.to( payload.de ).emit('mensaje-personal', mensaje );
      });

      // Disconnect
      // Marcar en la bd que el usuario se desconecto
      socket.on('disconnect', async () => {
        await usuarioDesconectado(uid);
        this.io.emit('lista-usuarios', await getUsuarios()); // volvemos a emitir para avisarle a todos que se desconecto
      });

    });


  }
}


module.exports = Sockets;