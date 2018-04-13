import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddCatalogPage } from './add-catalog';

@NgModule({
  declarations: [
    AddCatalogPage,
  ],
  imports: [
    IonicPageModule.forChild( AddCatalogPage )
  ],
  exports: [
    AddCatalogPage
  ]
})
export class AddConfigPageModule {}
