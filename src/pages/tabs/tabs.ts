import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = 'VentasPage';
  tab2Root = 'ComprasPage';
  tab3Root = 'ReportesPage';
  tab4Root = 'ConfiguracionPage';

  constructor() {

  }
}
