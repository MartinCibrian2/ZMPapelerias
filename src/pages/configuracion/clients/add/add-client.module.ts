import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddClientPage } from './add-client';
import { EditBuyPage } from '../../buys/edit/edit-buy';

@NgModule({
  declarations: [
    AddClientPage,
    EditBuyPage
  ],
  imports: [
    IonicPageModule.forChild( AddClientPage )
  ],
  exports: [
    AddClientPage,
    EditBuyPage
  ]
})
export class AddClientPageModule {}
