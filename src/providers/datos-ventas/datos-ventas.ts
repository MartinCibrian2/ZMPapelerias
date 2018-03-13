import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CouchDB from 'couchdb';
/*
  Generated class for the DatosVentasProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatosVentasProvider {

  constructor(public http: HttpClient) {
    console.log('Hello DatosVentasProvider Provider');
  }

}

import { Injectable } from '@angular/core';

 
@Injectable()
export class Data {
 
    db: any;
    remote: string = 'http://127.0.0.1:5984/couchblog';
 
    constructor() {
 
        this.db = new PouchDB('couchblog');
 
        let options = {
          live: true,
          retry: true,
          continuous: true
        };
 
        this.db.sync(this.remote, options);
 
    }
 
}

