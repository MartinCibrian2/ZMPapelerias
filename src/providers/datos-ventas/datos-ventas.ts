import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CouchDB from 'couchdb';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the DatosVentasProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatosVentasProvider {

  db: any;
  remote: string = 'http://127.0.0.1:5984/inventario';

  constructor(public http: HttpClient) {
    console.log('Hello DatosVentasProvider Provider');
      this.db = new PouchDB('inventario');

      let options = {
        live: true,
        retry: true,
        continuous: true
      };
      this.db.sync(this.remote, options);
    }

      ListalosProductos():{
        return this.http.get('http://192.168.1.180:5984/inventario/_design/productos_por_nombre/_view/productosxnombre').map(res => res.json());
      }

}

