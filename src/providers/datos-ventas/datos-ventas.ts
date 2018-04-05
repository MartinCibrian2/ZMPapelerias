import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import 'rxjs/add/operator/map';
//import { Observable } from 'rxjs/Observable';
//import { Subject }    from 'rxjs/Subject';
//import { of }         from 'rxjs/observable/of';
import PouchDB from 'pouchdb';

/* import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators'; */

interface Producto {
  id: string;
  nombre:any;
  descripcion:any;
  unidad:any;
  preciopublico:any;
  costo:any;
  descuentomayoreo:any;
  descuentomaximo:any;
  mayoreo:any;
  iva:any;
  inventariominimo:any;
  inventarioactual:any; }

@Injectable()
export class DatosVentasProvider 
{
    datos:any;
    CouchDBRemoto: any;
    PouchDBLocal: any;
    public productos: Producto[];
    remote: string = 'http://127.0.0.1:5984/inventario';

    private pouchdbTickets: any;

    constructor(
        public http: HttpClient
    ){  
        console.log('Hello DatosVentasProvider Provider'); 
        this.CouchDBRemoto =  'http://192.168.1.180:5984/inventario';
        this.PouchDBLocal = new PouchDB ('inventariolocal');

        if( !this.pouchdbTickets ){
            this.pouchdbTickets = new PouchDB('ticket');
        }
    }

    ListalosProductos() {
        if (this.datos) {
            return Promise.resolve(this.datos);
        }
        return new Promise(resolve => {	
        this.PouchDBLocal.allDocs({
            include_docs: true, 
            attachments: true
        }).then((result) => {
            this.datos = [];
            let docs = result.rows.map((row) => {
                this.datos.push(row.doc);
            });
                resolve(this.datos);
                this.PouchDBLocal.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
                    this.handleChange(change);
                });
            });
        }).catch(( error ) => {
            console.log( error );
        });
<<<<<<< HEAD
      }
    	borraunproducto (idproducto,revproducto) {
        this.PouchDBLocal.remove(idproducto,revproducto).then(function (response) {
          console.log("se borro el producto:"+ idproducto + revproducto);
          }).catch(function (err) {
          console.log(err);
        });
      }
=======
    }
>>>>>>> 4ec404ccf33e868881f00d8b35260610e7c8551f

    creaunproducto( producto ){
        this.PouchDBLocal
        .post(producto).then(function (response) {
            console.log("un nuevo producto se agrego");
        }).catch(function (err) {
            console.log(err);
        });
    }

    saveTicket( _tickets: any ){
        let result;
        let newTicket: any = {};
        newTicket.Conceptos    = new Array();

        newTicket.Serie = Math.random().toString(36).slice(2);
        newTicket.Folio = Math.random().toString(36).slice(2);
        newTicket.NoIdentificacion = this.randomString( 12, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'); // 'NoFolioOperacion';
        _tickets.forEach(( _ticket, index ) => {
            _ticket.ClaveUnidad = 'H87'; // Código => Pieza
            _ticket.Descripcion = 'Venta'; // Según Doc. Guía Anexo 20
            newTicket.Conceptos.push( _ticket );
        });
        newTicket.is_checkin = false;

        this.pouchdbTickets
        .post( newTicket )
        .then( function( response ){
            console.log( response );
            if( response.ok ){
                result = response;
            } else {
                result = false;
            }
        })
        .catch( function( error ){
            console.log( error );
            result = false;
        });

        return result;
    }
    randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    handleChange( change ){
        let changedDoc = null;
        let changedIndex = null;

        this.datos.forEach((doc, index) => {
            if( doc._id === change.id ){
                changedDoc = doc;
                changedIndex = index;
            }
        });
        //A document was deleted
        if(change.deleted){
            this.datos.splice(changedIndex, 1);
        } else {
            //A document was updated
            if(changedDoc){
                this.datos[changedIndex] = change.doc;
            } else {
                //A document was added
                this.datos.push(change.doc);
            }
        }
    }
}
