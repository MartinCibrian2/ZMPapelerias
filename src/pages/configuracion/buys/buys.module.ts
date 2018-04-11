import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BuysPage } from './buys';
import { AddBuyPageModule } from './add/add-buy.module';
import { AddBuyPage } from './add/add-buy';
import { EditBuyPage } from './edit/edit-buy';

@NgModule({
  declarations: [
     BuysPage,
  ],
  imports: [
    IonicPageModule.forChild( BuysPage),
    AddBuyPageModule
  ],
  entryComponents: [
    AddBuyPage,
    EditBuyPage
  ],
  exports: [
    AddBuyPage
  ]
})
export class BuysPageModule {}
