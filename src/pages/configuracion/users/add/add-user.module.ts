import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUserPage } from './add-user';
import { EditUserPage } from '../../users/edit/edit-user';

@NgModule({
  declarations: [
    AddUserPage,
    EditUserPage
  ],
  imports: [
    IonicPageModule.forChild( AddUserPage )
  ],
  exports: [
    AddUserPage,
    EditUserPage
  ]
})
export class AddUserPageModule {}
