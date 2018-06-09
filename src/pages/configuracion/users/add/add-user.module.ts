import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SelectSearchableModule } from 'ionic-select-searchable';

import { AddUserPage } from './add-user';
import { EditUserPage } from '../../users/edit/edit-user';

@NgModule({
  declarations: [
    AddUserPage,
    EditUserPage
  ],
  imports: [
    IonicPageModule.forChild( AddUserPage ),
    // Import Select searchable
    SelectSearchableModule
  ],
  exports: [
    AddUserPage,
    EditUserPage
  ]
})
export class AddUserPageModule {}
