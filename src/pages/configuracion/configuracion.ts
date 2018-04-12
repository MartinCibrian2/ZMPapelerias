import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { BillingPage } from '../billing/billing';
import { ClientsPage } from './clients/clients';
import { BuysPage } from './buys/buys';
import { ConfigsPage } from './configs/configs';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
  public billingPage = BillingPage;
  public clientsPage = ClientsPage;
  public buysPage    = BuysPage;
  public configsPage = ConfigsPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ){
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfiguracionPage');
  }

}
