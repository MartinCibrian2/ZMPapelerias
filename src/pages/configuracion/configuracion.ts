import { Component, ViewChild } from '@angular/core';
import { IonicPage, Nav, NavController, NavParams } from 'ionic-angular';

import { BillingPage } from '../billing/billing';
import { ClientsPage } from './clients/clients';
import { BuysPage } from './buys/buys';
import { ConfigsPage } from './configs/configs';
import { UsersPage } from './users/users';

@IonicPage()
@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html',
})
export class ConfiguracionPage {
  @ViewChild( Nav ) nav: Nav;
  rootPage = ConfigsPage;
  pagesConfig: any[] = [
    {
      title: 'Facturar',
      component: BillingPage
    }, {
      title: 'Clientes',
      component: ClientsPage
    }, {
      title: 'Compras',
      component: BuysPage
    }, {
      title: 'Usuarios',
      component: UsersPage
    }, {
      title: 'Configs',
      component: ConfigsPage
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ){
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ConfiguracionPage');
  }

  openPage( page ){
    this.rootPage = page.component;
  }

}
