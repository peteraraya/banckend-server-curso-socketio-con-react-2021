
// Servidor de express
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const cors = require('cors');

const Sockets = require('./sockets');

class Server {

    constructor(){

      this.app  = express();
      this.port = process.env.PORT;

      // Http Server
      this.server = http.createServer( this.app );

      // Configuraciones de sockets
      this.io = socketio( this.server, { /* configuraciones */} );


      // Inicializar sockets - obtenemos una referencia al objeto
      this.sockets = new Sockets(this.io);

    }

    middlewares(){
      // Desplegar el directorio público * ojo es coma no + 
      this.app.use( express.static( path.resolve( __dirname ,'../public') ));

      // CORS
      this.app.use(cors());

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