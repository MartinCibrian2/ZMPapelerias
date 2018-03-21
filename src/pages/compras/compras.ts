import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosVentasProvider } from '../../providers/datos-ventas/datos-ventas';
/**
 * Generated class for the ComprasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()

@Component({
  selector: 'page-compras',
  templateUrl: 'compras.html',
})
export class ComprasPage {

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
  inventarioactual:any;
  constructor
  ( public navCtrl: NavController, public navParams: NavParams, 
    public ListaProductos: DatosVentasProvider
  ) 
  {
  }
  nuevoproducto()
  {
    if (
    this.nombre!==""&&this.descripcion!==""&&this.unidad!==""&&this.preciopublico!==""&&this.costo!==""&&
    this.descuentomayoreo!==""&&this.descuentomaximo!==""&&this.mayoreo!==""&&this.iva!==""&&this.inventariominimo!==""&&
    this.inventarioactual!==""
    ){
      var productonuevo={
        "nombre": this.nombre,
        "descripcion": this.descripcion,
        "unidad": this.unidad,
        "precio-publico": this.preciopublico,
        "costo": this.costo,
        "descuento-mayoreo": this.descuentomayoreo,
        "descuento-maximo": this.descuentomaximo,
        "mayoreo": this.mayoreo,
        "iva": this.iva,
        "inventario-minimo": this.inventariominimo,
        "inventario-actual": this.inventarioactual
      };
      this.ListaProductos.creaunproducto(productonuevo);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComprasPage');
  }

}
