import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SelectSearchableModule } from 'ionic-select-searchable';

import { AddClientPage } from './add-client';
import { EditBuyPage } from '../../buys/edit/edit-buy';
import { EditClientPage } from '../edit/edit-client';

@NgModule({
  declarations: [
    AddClientPage,
    EditClientPage,
    EditBuyPage
  ],
  imports: [
    IonicPageModule.forChild( AddClientPage ),
    // Import Select searchable
    SelectSearchableModule
  ],
  exports: [
    AddClientPage,
    EditClientPage,
    EditBuyPage
  ]
})
export class AddClientPageModule {}
