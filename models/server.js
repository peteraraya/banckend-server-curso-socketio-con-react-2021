
// Servidor de express
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');

const Sockets = require('./sockets');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){

      this.app  = express();
      this.port = process.env.PORT;

      // Conectar a la Base de Datos MongoDB
      dbConnection();

      // Http Server
      this.server = http.createServer( this.app );

      // Configuraciones de sockets
      this.io = socketio( this.server, { /* configuraciones */} );

      // Inicializar sockets - obtenemos una referencia al objeto
      this.sockets = new Sockets(this.io);

    }
    // cuando veamos un use en express nos indica que es un middleware
    middlewares(){
      // Desplegar el directorio público * ojo es coma no + 
      this.app.use( express.static( path.resolve( __dirname ,'../public') ));

      // CORS
      this.app.use(cors());


      // Parseo del body
      this.app.use( express.json() );

      // API Endpoints
      this.app.use('/api/login', require('../router/auth'));
      this.app.use('/api/mensajes', require('../router/mensajes'));


      // Get de los ultimos tickets
      this.app.get('/ultimos', (req, res) =>{

          res.json({
            ok:true,
            ultimos: this.sockets.ticketList.ultimos13
          });

      });


    }

    configurarSocket(){
        // utilizamos nuestra clase personalizada de los sockets y enviamos nuestro this.io
        // new Sockets( this.io );
    }

    // Inicializar la app
    execute(){
      // inicializar middlewares
      this.middlewares();

      // Inicializar sockets
      // this.configurarSocket();

      // inicializar server
      this.server.listen( this.port	, () => {
        console.log('Server corriendo en puerto ', this.port);
      });

    }

}



module.exports = Server;