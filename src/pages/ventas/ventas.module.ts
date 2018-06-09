import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VentasPage } from './ventas';

@NgModule({
  declarations: [
    VentasPage,
  ],
  imports: [
    IonicPageModule.forChild(VentasPage),
  ],
})
export class VentasPageModule {}
