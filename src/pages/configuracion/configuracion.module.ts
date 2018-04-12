import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfiguracionPage } from './configuracion';

import { ConfigsPageModule } from './configs/configs.module';

@NgModule({
    declarations: [
        ConfiguracionPage
    ],
    imports: [
        IonicPageModule.forChild( ConfiguracionPage ),
        ConfigsPageModule
    ],
    exports: [
        
    ]
})
export class ConfiguracionPageModule {}
