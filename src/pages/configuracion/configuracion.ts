import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BillingPage } from '../billing/billing';
import { ClientsPage } from './clients/clients';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
  public billingPage = BillingPage;
  public clientsPage = ClientsPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');
  }

}
