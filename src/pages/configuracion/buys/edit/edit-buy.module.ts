import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditBuyPage } from './edit-buy';

@NgModule({
  declarations: [
    EditBuyPage,
  ],
  imports: [
    IonicPageModule.forChild( EditBuyPage ),
  ],
  exports: [
    EditBuyPage
  ]
})
export class EditBuyPageModule {}
