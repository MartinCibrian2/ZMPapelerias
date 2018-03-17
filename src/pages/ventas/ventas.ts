import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatosVentasProvider } from '../../providers/datos-ventas/datos-ventas';

/**
 * Generated class for the VentasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ventas',
  templateUrl: 'ventas.html',
})
export class VentasPage {
lista:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public ListaProductos: DatosVentasProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VentasPage');
 
      this.ListaProductos.ListalosProductos().subscribe((lista) => {

          this.lista = lista.rows.map(row => {
              return row.key;
          });

      });
  }

}
