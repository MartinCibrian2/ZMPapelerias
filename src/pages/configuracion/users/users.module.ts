import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsersPage } from './users';
import { AddUserPage } from './add/add-user';
import { EditUserPage } from './edit/edit-user';

import { UserService } from '../../../providers/users/users.service';
import { AddUserPageModule } from './add/add-user.module';
import { PipeModule } from '../../../app/pipes/pipe.module';

@NgModule({
  declarations: [
    UsersPage,
  ],
  imports: [
    IonicPageModule.forChild( UsersPage ),
    AddUserPageModule,
    PipeModule
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
