import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CatalogsPageModule } from './catalogs/catalogs.module';

import { ConfigsService } from '../../../providers/configs/configs.service';
import { ConfigsPage } from './configs';
import { AddConfigPageModule } from './add/add-config.module';
import { AddConfigPage } from './add/add-config';
import { PipeModule } from '../../../app/pipes/pipe.module';

@NgModule({
  declarations: [
     ConfigsPage
  ],
  imports: [
    IonicPageModule.forChild( ConfigsPage ),
    CatalogsPageModule,
    AddConfigPageModule,
    PipeModule
  ],
  entryComponents: [
    AddConfigPage,
    //EditConfigPage
  ],
  providers: [
    ConfigsService
  ],
  exports: [
    CatalogsPageModule,
    AddConfigPage
  ]
})
export class ConfigsPageModule {}
