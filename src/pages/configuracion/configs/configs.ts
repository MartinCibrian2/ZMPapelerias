import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ConfigsService } from '../../../providers/configs/configs.service';

import { AddConfigPage } from './add/add-config';
import { CatalogsPage } from './catalogs/catalogs';
import { EditConfigPage } from './edit/edit-config';
//import { EditConfigPage } from './edit/edit-config';

@IonicPage()
@Component({
    selector: 'page-configs',
    templateUrl: 'configs.html',
    providers: [
        ConfigsService
    ]
})
export class ConfigsPage {
    public configs     = [];
    public catalogs    = [];
    public searching;
    public optionsResult: any;

    public addConfigPage     = AddConfigPage;
    public editConfigPage    = EditConfigPage;
    public catalogsPage      = CatalogsPage;
    public paramsConfig      = { page: ConfigsPage };
    // For sync
    remoteCouchDbAddress: string;
    syncStatus: boolean;
    couchDbUp: boolean;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private configService: ConfigsService,
        private ngZone: NgZone,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ){
        /* this.configService.syncStatus
        .subscribe(( result ) => {
            this.syncStatus    = result;
        });
        this.configService.couchdbUp
        .subscribe(( result ) => {
            this.couchDbUp     = result;
        }); */

        //this.remoteCouchDbAddress    = this.configService.ConfigUrl;
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ConfigsPage');
    }

    ngOnInit(): void {
        this.getConfigs( );
    }

    getConfigs(){
        this.configService
        .getConfigs( {} )
        .subscribe(( data ) => {
            this.catalogs    = [];
            this.configs     = [];
            Object.keys( data )
            .forEach(( _catalog ) => {
                this.catalogs.push( _catalog );
                this.configs.push( data[ _catalog ]);
            });
        });
    }

    searchConfigByString( eve ){
        let val = eve.target.value;
        /* this.configService
        .searchConfigByString( val )
        .subscribe(( data ) => {
            this.configs = data.rows.map( row => {
                return row.doc;
            });
        }); */
    }

    deleteConfig( item: any): void {
        /* this.optionsResult    = {
            "message": item.nombre + " se ha eliminado",
            "duration": 5000,
            "position": 'bottom'
        }

        let confirm = this.alertCtrl.create({
            title: "Seguro de eliminar " + item.nombre + " ?",
            message: "Si acepta eliminar " + item.nombre + " ya no podrá recuperarlo.",
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        this.optionsResult.message    = "Se Canceló Eliminar " + item.nombre;
                        this.presentToast( this.optionsResult );
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        // Action delete item.
                        item.active    = false;
                        this.configService
                        .put( item )
                        .subscribe(( response ) => {
                            this.getConfigs();
                            this.presentToast( this.optionsResult );
                        },
                        ( error ) => {
                            console.log( error );
                        });
                     }
                }
            ]
        });
        confirm.present(); */
    }

    openNavPage( page, param ){
        this.navCtrl.push( page, { catalog: param });
    }

    presentToast( _options: any ): void {
        let _default    = {
            message: 'Action completed',
            duration: 3000
        };

        if( Object.keys( _options ).length ){
            // Contains values.
        } else {
            _options    = Object.create( _default );
        }

        let toast = this.toastCtrl.create( _options );
        toast.present();
    }

}
