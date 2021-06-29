
const { v4: uuidv4 } = require('uuid');

class Ticket {

  constructor( number ){
    this.id         = uuidv4();
    this.numero     = number;
    this.escritorio = null;
    this.agente     =null;
  }

}

module.exports = Ticket;