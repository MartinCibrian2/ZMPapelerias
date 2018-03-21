import { Component, OnInit, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosVentasProvider } from '../../providers/datos-ventas/datos-ventas';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import * as _ from 'lodash';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
 import { Storage } from '@ionic/storage';
 import { LoadingController } from 'ionic-angular';
 import { AlertController } from 'ionic-angular';
 import PouchDB from 'pouchdb';

/**
 * Generated class for the VentasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Producto {
  id: string;
  nombre: string;
  descripcion:string;
  unidad:string;
  preciopublico:string;
  costo:string;
  descuentomayoreo:string;
  descuentomaximo:string;
  mayoreo:string;
  iva:string;
  inventariominimo:string;
  inventarioactual:string
 }

@IonicPage()
@Component({
  selector: 'page-ventas',
  templateUrl: 'ventas.html',
})
export class VentasPage implements OnInit {
  //productos: Producto[];
  productos: any[];
  productoporcomprar: string;
  datos: Producto[];
  remoto:any;
  db: any;
  datoslocales:Producto[];
  productonombre:any;
  productoprecio:any;

  constructor
  ( public navCtrl: NavController, public navParams: NavParams,private http:HttpClient, 
    public ListaProductos: DatosVentasProvider, public alertCtrl: AlertController
  ) 
  {
  }


  ngOnInit(): void 
  {
   this.obtenlista();         
  }

  obtenlista() {
      this.ListaProductos.ListalosProductos().then((datos) => {
        this.productos = datos;
        console.log(datos)
      });
   
    } 

  agregaproducto(productoporcomprar) { console.log(productoporcomprar);  }


 


  ionViewDidLoad() {
    console.log('ionViewDidLoad VentasPage');
      };
  }

