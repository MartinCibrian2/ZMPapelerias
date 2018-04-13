import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

//import { CatalogsService } from '../../../providers/Catalogs/Catalogs.service';
import { CatalogsPage } from './catalogs';
//import { AddCatalogPageModule } from './add/add-catalog.module';
//import { AddCatalogPage } from './add/add-catalog';
//import { EditCatalogPage } from './edit/edit-catalog';

@NgModule({
  declarations: [
     CatalogsPage,
  ],
  imports: [
    IonicPageModule.forChild( CatalogsPage )
    //AddCatalogPageModule
  ],
  entryComponents: [
    //AddCatalogPage,
    //EditCatalogPage
  ],
  providers: [
    //CatalogsService
  ],
  exports: [
    CatalogsPage
    //AddCatalogPage
  ]
})
export class CatalogsPageModule {}
