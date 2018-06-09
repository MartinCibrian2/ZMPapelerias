import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddBuyPage } from './add-buy';

@NgModule({
  declarations: [
    AddBuyPage,
  ],
  imports: [
    IonicPageModule.forChild( AddBuyPage )
  ],
  exports: [
    AddBuyPage
  ]
})
export class AddBuyPageModule {}
