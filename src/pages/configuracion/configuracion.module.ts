import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracionPage } from './configuracion';

import { ConfigsPageModule } from './configs/configs.module';
import { UsersPageModule } from './users/users.module';
import { ClientsPageModule } from './clients/clients.module';

@NgModule({
    declarations: [
        ConfiguracionPage
    ],
    imports: [
        IonicPageModule.forChild( ConfiguracionPage ),
        ConfigsPageModule,
        UsersPageModule,
        ClientsPageModule
    ],
    exports: [
        ConfigsPageModule,
        UsersPageModule,
        ClientsPageModule
    ]
})
export class ConfiguracionPageModule {}
