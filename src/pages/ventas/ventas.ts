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
<<<<<<< HEAD
 import { lineaticket,encabezadoticket } from '../../app/datos';
/**
 * Generated class for the VentasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
=======
 import { lineaticket } from '../../app/datos';

//import { CheckinService } from '../../providers/billing/checkin.service';
>>>>>>> 4ec404ccf33e868881f00d8b35260610e7c8551f

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
<<<<<<< HEAD
  productos: any[];
  ticketenc: Ticketenc;
  detalleticket: any[];
  encticket:any;
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

=======
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
>>>>>>> 4ec404ccf33e868881f00d8b35260610e7c8551f

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

<<<<<<< HEAD
  agregaproducto(productoporcomprar) 
  { 
    console.log('El producto a comprar es' + productoporcomprar);  
   // this.ticket.push ( this.productos.find ( articulo => articulo.id == productoporcomprar ));
   this.articulo =  this.productos.find ( articulo => articulo._id == productoporcomprar );
   console.log('El articulo a comprar es ' + this.articulo.nombre);
   console.log(this.articulo);
   console.log(parseFloat(this.articulo.preciopublico));
   var totalticket:number;
   var ticketidarticulo:string = productoporcomprar;
   console.log(ticketidarticulo);
   var ticketnombreart = this.articulo.nombre;
   var ticketunidadart = this.articulo.unidad;
   var ticketcantidadart = 1;
   var ticketprecioart = parseFloat (this.articulo.preciopublico);
   var ticketdescuentoart = parseFloat (this.articulo.descuentomayoreo);
   var ticketivaart = parseFloat(this.articulo.iva);
   var ticketimporteart = ( ticketcantidadart * ticketprecioart);
   if (this.detalleticket == undefined) 
    {
      totalticket=0;
      totalticket= ticketimporteart;
      this.detalleticket = 
      [ 
        new lineaticket(ticketidarticulo,ticketnombreart, ticketunidadart, ticketcantidadart, ticketprecioart, ticketdescuentoart, ticketivaart, ticketimporteart )
      ];
      this.encticket =
      (
        new encabezadoticket(1,"pagado","aad34-234df","Publico en general","AARR-001122-MK5", "gastos generales", "Efectivo", "24-03-2018","Cihuatlan",48970, totalticket)
      );
    }
    else
    {
      let encontrado:boolean;
      encontrado = false;
      let idtemp:string;
      let longitud:number;
      longitud = this.detalleticket.length;
      console.log("La longitud es: "+ longitud);
      for (var i = 0; i < longitud; i++) {
        idtemp = this.detalleticket[i].idarticulo;
        if (idtemp == productoporcomprar) {
          this.detalleticket[i].cantidadart += 1;
          this.detalleticket[i].importeart = this.detalleticket[i].cantidadart * this.detalleticket[i].precioart;
          ticketimporteart = this.detalleticket[i].importeart;
          encontrado = true;
        }
      }
      totalticket=0;

      if (encontrado)
      {
        totalticket= ticketimporteart;
        this.encticket.total = (parseFloat(this.encticket.total) + ticketprecioart);
        console.log("articulo encontrado en el array");
      }
      else 
      {
        totalticket= ticketimporteart;
        this.encticket.total = (parseFloat(this.encticket.total) + totalticket);
        this.detalleticket.push 
        (
          new lineaticket(ticketidarticulo,ticketnombreart, ticketunidadart, ticketcantidadart, ticketprecioart, ticketdescuentoart, ticketivaart, ticketimporteart ),
        )
      }

    }
  }


  borrarproducto(productoporborrar,productoporborrarrev) 
  {
    this.ListaProductos.borraunproducto(productoporborrar,productoporborrarrev);
  }
=======
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
>>>>>>> 4ec404ccf33e868881f00d8b35260610e7c8551f

    closeBuy( ){
        this.ListaProductos.saveTicket( this.detalleticket );
    }

}

