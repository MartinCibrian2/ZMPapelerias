import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DatosVentasProvider } from '../../providers/datos-ventas/datos-ventas';
import { CheckinService } from '../../providers/billing/checkin.service';

@IonicPage()
@Component({
  selector: 'page-compras',
  templateUrl: 'compras.html',
})
export class ComprasPage implements OnInit {

  public claveProdServs: any = new Array();
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
  claveProdServ: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, 
    public ListaProductos: DatosVentasProvider,
    private checkinService: CheckinService
  ) {
  }

  ngOnInit(){
      this.getClaveProdServs();
  }

  getClaveProdServs(){
      this.checkinService
      .getCatalogClaveProdServs()
      .subscribe(
          response => {
              if( response.c_ClaveProdServ ){
                  this.claveProdServs = response.c_ClaveProdServ;
              } else {
                  console.log( response );
              }
          },
    error => {
      console.log( <any> error );
    }
      );
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
        "preciopublico": this.preciopublico,
        "costo": this.costo,
        "descuentomayoreo": this.descuentomayoreo,
        "descuentomaximo": this.descuentomaximo,
        "mayoreo": this.mayoreo,
        "iva": this.iva,
        "inventariominimo": this.inventariominimo,
        "inventarioactual": this.inventarioactual,
        "claveProdServ": this.claveProdServ
      };
      this.ListaProductos.creaunproducto(productonuevo);
      this.nombre="";
      this.descripcion="";
      this.unidad="";
      this.preciopublico="";
      this.costo="";
      this.descuentomayoreo="";
      this.descuentomaximo="";
      this.mayoreo="";
      this.iva="";
      this.inventariominimo="";
      this.inventarioactual="";
      this.claveProdServ = "";
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ComprasPage');
  }

}
