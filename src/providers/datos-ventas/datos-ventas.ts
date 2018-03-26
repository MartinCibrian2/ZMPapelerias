import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import PouchDB from 'pouchdb';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

 /*
  Generated class for the DatosVentasProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
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
 

  constructor(public http: HttpClient) 
  {  
    console.log('Hello DatosVentasProvider Provider'); 
    this.CouchDBRemoto =  'http://192.168.1.180:5984/inventario';
    this.PouchDBLocal = new PouchDB ('inventariolocal');
  }


      ListalosProductos() 
      {
        if (this.datos) {
          return Promise.resolve(this.datos);
        }
        return new Promise(resolve => {	
          this.PouchDBLocal.allDocs({
            include_docs: true, 
            attachments: true
          }).then((result) => 
          {
            this.datos = [];
            let docs = result.rows.map((row) => 
            {
              this.datos.push(row.doc);
            });
            resolve(this.datos);
            this.PouchDBLocal.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
              this.handleChange(change);
           });
                       });
            
          }).catch((error) => 
          {
            console.log(error);
          });
    
        };
     
    	creaunproducto (producto) {
        this.PouchDBLocal.post(producto).then(function (response) {
          console.log("un nuevo producto se agrego");
          }).catch(function (err) {
          console.log(err);
        });
      }
    	borraunproducto (idproducto,revproducto) {
        this.PouchDBLocal.remove(idproducto,revproducto).then(function (response) {
          console.log("se borro el producto:"+ idproducto + revproducto);
          }).catch(function (err) {
          console.log(err);
        });
      }

      handleChange(change){

        let changedDoc = null;
        let changedIndex = null;
  
        this.datos.forEach((doc, index) => {
  
          if(doc._id === change.id){
            changedDoc = doc;
            changedIndex = index;
          }
  
        });
  
        //A document was deleted
        if(change.deleted){
          this.datos.splice(changedIndex, 1);
        }
        else {
  
          //A document was updated
          if(changedDoc){
            this.datos[changedIndex] = change.doc;
          }
  
          //A document was added
          else {
            this.datos.push(change.doc);
          }
  
        }
  }

    }