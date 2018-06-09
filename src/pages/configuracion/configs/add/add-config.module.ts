import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddConfigPage } from './add-config';

@NgModule({
  declarations: [
    AddConfigPage,
  ],
  imports: [
    IonicPageModule.forChild( AddConfigPage )
  ],
  exports: [
    AddConfigPage
  ]
})
export class AddConfigPageModule {}
