
// Servidor de express
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const Sockets = require('./sockets');

class Server {

    constructor(){

      this.app  = express();
      this.port = process.env.PORT;

      // Http Server
      this.server = http.createServer( this.app );

      // Configuraciones de sockets
      this.io = socketio( this.server, { /* configuraciones */} );

    }

    middlewares(){
      // Desplegar el directorio público * ojo es coma no + 
      this.app.use( express.static( path.resolve( __dirname ,'../public') ));
    }

    configurarSocket(){
        // utilizamos nuestra clase personalizada de los sockets y enviamos nuestro this.io
        new Sockets( this.io );
    }

    // Inicializar la app
    execute(){
      // inicializar middlewares
      this.middlewares();

      // Inicializar sockets
      this.configurarSocket();

      // inicializar server
      this.server.listen( this.port	, () => {
        console.log('Server corriendo en puerto ', this.port);
      });

    }

}



module.exports = Server;