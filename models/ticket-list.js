
const Ticket = require('./ticket');

class TicketList {

  constructor(){
    this.ultimoNumero = 0;

    this.pendientes   = [];
    this.asignados    = [];
  }


  get siguienteNumero(){
      this.ultimoNumero++;
      return this.ultimoNumero;
  }

  // retornando los ultimos 13 ( 3 en tarjetas y 10 en historial )
  get ultimos13(){
      return this.asignados.slice(0,13);
  }

  crearTicket(){
      const nuevoTicket = new Ticket( this.siguienteNumero );
      this.pendientes.push( nuevoTicket );
      return nuevoTicket;
  }


  asignarTicket(agente, escritorio) {

    if (this.pendientes.length === 0) {
      return null;
    }
    // remueve el primer elemento de los arreglos y lo regresa o el unshif que borra el ultimo elemento
    const siguienteTicket = this.pendientes.shift();

    siguienteTicket.agente = agente;
    siguienteTicket.escritorio = escritorio;
    // unshift  : inserta un nuevo elemento al inicio del el arreglo
    this.asignados.unshift(siguienteTicket);

    return siguienteTicket;
  }
}

module.exports = TicketList;