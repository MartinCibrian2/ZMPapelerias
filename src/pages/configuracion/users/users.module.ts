import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersPage } from './users';
import { AddUserPage } from './add/add-user';
import { UserService } from '../../../providers/users/users.service';
import { AddUserPageModule } from './add/add-user.module';
import { EditUserPage } from './edit/edit-user';

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    IonicPageModule.forChild( UsersPage ),
    AddUserPageModule,
  ],
  entryComponents: [
    AddUserPage,
    EditUserPage
  ],
  providers: [
    UserService
  ]
})
export class UsersPageModule {}
