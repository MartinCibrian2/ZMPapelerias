import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientsPage } from './clients';
import { AddClientPage } from './add/add-client';
import { EditClientPage } from './edit/edit-client';

import { ClientService } from '../../../providers/clients/client.service';
import { AddClientPageModule } from './add/add-client.module';
import { PipeModule } from '../../../app/pipes/pipe.module';

@NgModule({
  declarations: [
    ClientsPage,
  ],
  imports: [
    IonicPageModule.forChild( ClientsPage ),
    AddClientPageModule,
    PipeModule
  ],
  entryComponents: [
    AddClientPage,
    EditClientPage
  ],
  providers: [
    ClientService
  ]
})
export class ClientsPageModule {}
