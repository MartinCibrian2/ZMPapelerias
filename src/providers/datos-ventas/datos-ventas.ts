import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';

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
  nombre: string;
  preciopublico: number;
  iva: number;
  inventarioactual: number; }

@Injectable()
export class DatosVentasProvider 
{
  datos:any;
  db: any;
  public productos: Producto[];
  remote: string = 'http://127.0.0.1:5984/inventario';
 
  constructor(public http: HttpClient) {  console.log('Hello DatosVentasProvider Provider');  }
      ListalosProductos() 
      //:Observable <Producto[]> 
      {
        return this.http.get('http://192.168.1.180:5984/inventario/_design/productos_por_nombre/_view/productosxnombre');      
        //return null; 
      }
}
