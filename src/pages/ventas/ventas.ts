import { Component, OnInit, Input } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosVentasProvider } from '../../providers/datos-ventas/datos-ventas';
import { HttpClient } from '@angular/common/http';
//import 'rxjs/add/operator/map';
//import { Observable } from 'rxjs/Observable';
//import { Subject }    from 'rxjs/Subject';
//import { of }         from 'rxjs/observable/of';
import * as _ from 'lodash';
/* import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators'; */
 import { Storage } from '@ionic/storage';
 import { LoadingController } from 'ionic-angular';
 import { AlertController } from 'ionic-angular';
 import PouchDB from 'pouchdb';
 import { lineaticket } from '../../app/datos';

//import { CheckinService } from '../../providers/billing/checkin.service';

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
  inventarioactual:string,
  claveProdServ: string
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
  providers: []
})
export class VentasPage implements OnInit {
    productos: any[];
    ticketenc: Ticketenc;
    detalleticket: any[] = new Array;
    productoporcomprar: string;
    datos: Producto[];
    remoto:any;
    db: any;
    datoslocales:Producto[];
    productonombre:any;
    productoprecio:any;
    articulo: Producto;
    claveProdServ: any;

    constructor(
        public navCtrl: NavController, 
        public navParams: NavParams,
        private http:HttpClient, 
        public ListaProductos: DatosVentasProvider, 
        public alertCtrl: AlertController
    ) { }

    ngOnInit(): void {
        this.obtenlista();         
    }

    obtenlista() {
        this.ListaProductos.ListalosProductos()
        .then(
            ( datos ) => {
                this.productos = datos;
        });
    } 

    agregaproducto( productoporcomprar ){
        // this.ticket.push ( this.productos.find ( articulo => articulo.id == productoporcomprar ));
        this.articulo =  this.productos.find ( articulo => articulo._id == productoporcomprar );
        console.log('El articulo a comprar es ' + this.articulo.nombre);
        console.log( this.articulo )

        var ticketidarticulo:string = productoporcomprar;
        var ticketnombreart = this.articulo.nombre;
        var ticketunidadart = this.articulo.unidad;
        var ticketcantidadart = 2;
        var ticketprecioart = parseFloat (this.articulo.preciopublico);
        var ticketdescuentoart = parseFloat (this.articulo.descuentomayoreo);
        var ticketivaart = this.articulo.iva;
        var ticketimporteart = ( ticketcantidadart * ticketprecioart);

        var _tickeDetail = new lineaticket(
            ticketidarticulo,
            ticketnombreart,
            ticketunidadart,
            ticketcantidadart,
            ticketprecioart,
            ticketdescuentoart,
            ticketivaart,
            ticketimporteart,
            this.articulo.claveProdServ
        );

        this.detalleticket.push( _tickeDetail );
        //this.ticket.push ( this.ticketart );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad VentasPage');
    }

    closeBuy( ){
        this.ListaProductos.saveTicket( this.detalleticket );
    }

}

