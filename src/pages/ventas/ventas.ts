import { Component, OnInit, Input } from '@angular/core';
import { NgModule }      from '@angular/core';
import {ReactiveFormsModule, FormControl, FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosVentasProvider } from '../../providers/datos-ventas/datos-ventas';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import { of }         from 'rxjs/observable/of';
import * as _ from 'lodash';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import {    debounceTime, distinctUntilChanged, switchMap  } from 'rxjs/operators';
 import { Storage } from '@ionic/storage';
 import { LoadingController } from 'ionic-angular';
 import { AlertController } from 'ionic-angular';
 import PouchDB from 'pouchdb';
 import { lineaticket,encabezadoticket } from '../../app/models/venta.model';
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
  resproductos: any;
  buscaproducto$ = new Subject<string>();
  ticketenc: Ticketenc;
  detalleticket: any[];
  encticket:any;
  productoporcomprar: string;
  datos: Producto[];
  datoslocales:any[];
  productonombre:any;
  productoprecio:any;
  articulo: Producto;
  private searchField: FormControl;
  private results: Observable<any[]>;
  private loading: boolean = false;
  constructor
  ( public navCtrl: NavController, public navParams: NavParams,private http:HttpClient, 
    public ListaProductos: DatosVentasProvider, public alertCtrl: AlertController
  ) 
  {

  }



  ngOnInit(): void 
  {
   this.obtenlista();    
   this.encticket =
      (
        new encabezadoticket(1,"pagado","aad34-234df","Publico en general","AARR-001122-MK5", "gastos generales", "Efectivo", "24-03-2018","Cihuatlan",48970,0)
      );
   this.searchField = new FormControl();
   this.results = this.searchField.valueChanges
       .debounceTime(400)
       .distinctUntilChanged()
       .do(_ => this.loading = true)
       .switchMap(term => this.ListaProductos.BuscarProductos(term))
       .do(_ => this.loading = false)
  }

  obtenlista() 
    {
      this.ListaProductos.ListalosProductos().then((datos) => 
      {
        this.productos = datos;
        console.log(datos)
      });
   
    } 

    cobrarticket(folioticket){
      console.log('Se cobra el ticket'+ folioticket ); 
    }
    facturarticket(folioticket){
      console.log('Se factura el ticket'+ folioticket ); 
    }
    cancelarticket(folioticket){
      console.log('Se cancela el ticket'+ folioticket ); 
    }

    imprimirticket(folioticket):void {
      console.log('Se imprime el ticket'+ folioticket ); 
      this.cobrarticket(folioticket);
        let printContents, popupWin;
        //printContents = document.getElementById('secciondeimpresion').innerHTML;
        //<body onload="window.print();window.close()">${printContents}</body>
        printContents = " <h2>Impresion del Ticket Folio :"+folioticket+" </h2>";
        popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
          <html>
            <head>
              <title>Ticket de Venta</title>
              <style>
              //........Customized style.......
              </style>
            </head>
            <body onload="window.print()">${printContents}</body>
          </html>`
        );
        popupWin.document.close();
    }

  agregaproducto(productoporcomprar) 
  { 
   this.articulo =  this.productos.find ( articulo => articulo._id == productoporcomprar );
   var totalticket:number;
   var ticketidarticulo:string = productoporcomprar;
   var ticketnombreart = this.articulo.nombre;
   var ticketunidadart = this.articulo.unidad;
   var ticketcantidadart = 1;
   var ticketprecioart = parseFloat (this.articulo.preciopublico);
   var ticketdescuentoart = parseFloat (this.articulo.descuentomayoreo);
   var ticketivaart = parseFloat(this.articulo.iva);
   var ticketimporteart = ( ticketcantidadart * ticketprecioart);
   var claveProdServ = "82121700";
   if (this.detalleticket == undefined) 
    {
      totalticket=0;
      totalticket=ticketimporteart;
      this.detalleticket = 
      [ 
        new lineaticket(ticketidarticulo,ticketnombreart, ticketunidadart, ticketcantidadart, ticketprecioart, ticketdescuentoart, ticketivaart, ticketimporteart,claveProdServ )
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
      for (var i = 0; i < longitud; i++) {
        idtemp = this.detalleticket[i].idarticulo;
        if (idtemp == productoporcomprar) {
          this.detalleticket[i].cantidadart += 1;
          this.detalleticket[i].importeart = this.detalleticket[i].cantidadart * this.detalleticket[i].precioart;
          ticketimporteart = this.detalleticket[i].precioart;
          encontrado = true;
        }
      }
      totalticket=0;
      if (encontrado)
      {
        totalticket= ticketimporteart;
        this.encticket.total = this.encticket.total + totalticket;
      }
      else 
      {
        totalticket= ticketimporteart;
        this.encticket.total = this.encticket.total + totalticket;
        this.detalleticket.push 
        (
          new lineaticket(ticketidarticulo,ticketnombreart, ticketunidadart, ticketcantidadart, ticketprecioart, ticketdescuentoart, ticketivaart, ticketimporteart, claveProdServ ),
        )
      }

    }
  }


  borrarproducto(productoporborrar,productoporborrarrev) 
  {
        this.ListaProductos.borraunproducto(productoporborrar,productoporborrarrev);
  }

  buscaproducto(termino:any)
  {
<<<<<<< HEAD
    this.ListaProductos.ListalosProductos().then((datos) => 
    {
      this.resproductos = datos;
      console.log(datos);
      let val = termino.target.value;
      // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.resproductos  = this.resproductos.filter((articulo) => {
        return (articulo.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    });
=======

    this.resproductos = this.productos;
    let cadena=termino.target.value;
     // if the value is an empty string don't filter the items
      if (cadena && cadena.trim() != '') {
        this.resproductos = this.resproductos.filter((item) => {
          return (item.nombre.toLowerCase().indexOf(cadena.toLowerCase()) > -1);
        })
      }
    console.log(this.resproductos);
>>>>>>> 7c1d2b9429d044f78b759d51488cfa92b275a7b7
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VentasPage');
      };
  }

