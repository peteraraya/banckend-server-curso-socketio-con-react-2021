
/**
 * Tendremos una clase que tendrá un arreglo de banda
 * en el cual voy a poder insertar, actualizar, editar  orientado a objetos -->
 */

const Band = require("./band");

class BandList {

  constructor (){

      this.bands = [
        new Band('Metallica'),
        new Band('Link Park'),
        new Band('Green Day'),
        new Band('Nirvana'),
      ];
  }

  // Agregar banda
  addBand(name){
      const newBand = new Band( name );
      this.bands.push( newBand );
      return this.bands;
  }

  // Remover las Banda
  removeBand(id){
    this.bands = this.bands.filter( band => band.id !== id );
    return this.bands;
  }

  // Obtener banda
  getBand(){
    return this.bands;
  }

  // ingreso de votos
  increaseVotes(id){
    this.bands = this.bands.map( band =>{

        if ( band.id === id ) {
            band.votes += 1;
        }
        return band;
    });
  }
  decreaseVotes(id){
    this.bands = this.bands.map( band =>{

        if ( band.id === id && band.votes >= 1 ) {
            band.votes -= 1;
        }
        return band;
    });
  }


  // cambio de nombre
  changeName(id, newName){
    this.bands = this.bands.map(band => {

      if (band.id === id) {
        band.name = newName;
      }

      return band;

    });
    
  }

}



module.exports = BandList;