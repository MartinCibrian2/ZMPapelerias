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
 import { lineaticket } from '../../app/datos';
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

interface Ticketenc 
{
  folio:number;
  estado:string;
  clienteid:string;
  clientenom:string;
  fecha:Date;
  subtotal:number;
  impuesto:number;
  total:number
}

@IonicPage()
@Component({
  selector: 'page-ventas',
  templateUrl: 'ventas.html',
})
export class VentasPage implements OnInit {
  productos: any[];
  ticketenc: Ticketenc;
  detalleticket: any[];
  productoporcomprar: string;
  datos: Producto[];
  remoto:any;
  db: any;
  datoslocales:Producto[];
  productonombre:any;
  productoprecio:any;
  articulo: Producto;
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

  obtenlista() 
    {
      this.ListaProductos.ListalosProductos().then((datos) => 
      {
        this.productos = datos;
        console.log(datos)
      });
   
    } 

  agregaproducto(productoporcomprar) 
  { 
    console.log('El producto a comprar es' + productoporcomprar);  
   // this.ticket.push ( this.productos.find ( articulo => articulo.id == productoporcomprar ));
   this.articulo =  this.productos.find ( articulo => articulo._id == productoporcomprar );
   console.log('El articulo a comprar es ' + this.articulo.nombre);
   console.log(this.articulo);
   console.log(parseFloat(this.articulo.preciopublico));

   var ticketidarticulo:string = productoporcomprar;
   console.log(ticketidarticulo);
   var ticketnombreart = this.articulo.nombre;
   console.log(ticketnombreart)
    var ticketunidadart = this.articulo.unidad;
   console.log(ticketunidadart);
   var ticketcantidadart = 2;
   console.log(ticketcantidadart);
   var ticketprecioart = parseFloat (this.articulo.preciopublico);
   console.log(ticketprecioart);
   var ticketdescuentoart = parseFloat (this.articulo.descuentomayoreo);
   console.log(ticketdescuentoart);
   var ticketivaart = parseFloat(this.articulo.iva);
   console.log(ticketivaart);
   var ticketimporteart = ( ticketcantidadart * ticketprecioart);
   console.log(ticketimporteart);
   if (this.detalleticket == undefined) 
    {
      this.detalleticket = 
      [ 
        new lineaticket(ticketidarticulo,ticketnombreart, ticketunidadart, ticketcantidadart, ticketprecioart, ticketdescuentoart, ticketivaart, ticketimporteart )
      ];
    }
    else 
    {
      this.detalleticket.push 
      (
        new lineaticket(ticketidarticulo,ticketnombreart, ticketunidadart, ticketcantidadart, ticketprecioart, ticketdescuentoart, ticketivaart, ticketimporteart ),
      );
    }
   //this.ticket.push ( this.ticketart );
   console.log(this.detalleticket);
     }


 


  ionViewDidLoad() {
    console.log('ionViewDidLoad VentasPage');
      };
  }

