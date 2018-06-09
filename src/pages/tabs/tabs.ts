import { Component } from '@angular/core';
import { IonicPage, Nav } from 'ionic-angular';
import { VentasPage } from '../ventas/ventas';
import { ComprasPage } from '../compras/compras';
import { ReportesPage } from '../reportes/reportes';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = VentasPage;
  tab2Root = ComprasPage;
  tab3Root = ReportesPage;
  tab4Root = ConfiguracionPage;

  constructor(
    public nav: Nav
  ){

  }

  goBack(){
    this.nav.setRoot( LoginPage );
  }
}
