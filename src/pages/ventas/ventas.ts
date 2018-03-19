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
/**
 * Generated class for the VentasPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

interface Producto {
  id: string;
  nombre: string;
  identificador: string;
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
  constructor(public navCtrl: NavController, public navParams: NavParams,private http:HttpClient, public ListaProductos: DatosVentasProvider) {
  }
  ngOnInit(): void 
  {
   this.obtenlista();         
  }

  obtenlista() {
    this.ListaProductos.ListalosProductos()
    .subscribe (
      (res) => { 
        this.productos = res['rows'];
        console.log(this.productos);
      },
      (error) =>{
        console.error(error);
      }
    )
      }    

  agregaproducto(productoporcomprar) { console.log(productoporcomprar);  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VentasPage');
      };
  }

