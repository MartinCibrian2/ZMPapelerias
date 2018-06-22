import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ConfigsService } from '../../../providers/configs/configs.service';

import { AddConfigPage } from './add/add-config';
import { CatalogsPage } from './catalogs/catalogs';
import { EditConfigPage } from './edit/edit-config';
import { AppSettings } from '../../../app/common/api.path';
import { AuthenticationService } from '../../../providers/authentication.service';
//import { EditConfigPage } from './edit/edit-config';

@IonicPage()
@Component({
    selector: 'page-configs',
    templateUrl: 'configs.html',
    providers: [
        ConfigsService
    ]
})
export class ConfigsPage
{
    public titlePage: string;
    public titleApp: string;
    public configs     = [];
    public catalogs    = [];
    public token: string;
    public optionsResult: any;
    public notice: string = '';
    public url: string;
    // For sort list
    public descending: boolean = false;
    public order: number;
    public column: string = 'name';
    // For pagination by infiniteScroll
    public page      = 1;
    public perPage   = 0;
    public totalData = 0;
    public totalPage = 0;

    public addConfigPage     = AddConfigPage;
    public editConfigPage    = EditConfigPage;
    public catalogsPage      = CatalogsPage;
    public paramsConfig      = { page: ConfigsPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private configService: ConfigsService,
        private _authService: AuthenticationService,
        private appSettings: AppSettings
    ){
        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Catalogos";
        this.token        = this._authService.getToken();
        
        this.url    = appSettings.path_api;
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ConfigsPage');
    }

    ngOnInit(): void {
        this.getConfigs( );
    }

    getConfigs( clean: boolean = true, params?: any ){
        this.configService.get( this.token, params )
        .subscribe(
            response => {
                if( response.data.length ){
                    this.perPage      = response.perPage;
                    this.totalData    = response.totalData;
                    this.totalPage    = response.totalPage;

                    if( clean ){
                        this.configs    = [];
                        this.page       = 1;
                    } else {
                        // It continues the load.
                    }

                    response.data.map(( row ) => {
                        this.configs.push( row );
                    });
                    this.sort();
                } else {
                    // It is empty.
                }
            }, error => {
                console.log( <any> error )
            }
        );
    }

    sort(){
        this.descending    = !this.descending;
        this.order         = this.descending ? 1 : -1;
    }

}
