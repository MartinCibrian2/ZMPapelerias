import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientPage } from './client';

import { SearchPipe } from '../../../../app/pipes/search.pipe';

@NgModule({
    declarations: [
        ClientPage,
        SearchPipe
    ],
    imports: [
        IonicPageModule.forChild( ClientPage ),
    ]
})
export class ClientPageModule {}
