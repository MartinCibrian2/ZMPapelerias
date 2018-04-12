import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

//import { CatalogsService } from '../../../providers/catalogs/catalogs.service';

//import { AddCatalogPage } from './add/add-catalog';
//import { EditcatalogPage } from './edit/edit-catalog';

@IonicPage()
@Component({
    selector: 'page-catalogs',
    templateUrl: 'catalogs.html',
    providers: [
        //CatalogsService
    ]
})
export class CatalogsPage 
{
    public catalogs    = [];
    public searching;
    public optionsResult: any;

    //public addConfigPage = AddCatalogPage;
    public paramsConfig  = { page: CatalogsPage };

    public catalogsPage   = CatalogsPage;
    //public paramsCatalogs = { page: CatalogsPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        //private catalogService: CatalogsService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ){
        /* this.catalogService.syncStatus
        .subscribe(( result ) => {
            this.syncStatus    = result;
        });
        this.catalogService.couchdbUp
        .subscribe(( result ) => {
            this.couchDbUp     = result;
        }); */

        //this.remoteCouchDbAddress    = this.catalogService.ConfigUrl;
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ConfigsPage');
    }

    ngOnInit(): void {
        this.getCatalogs( );
    }

    getCatalogs(){
        /* this.catalogService
        .getCatalogs( {} )
        .subscribe(( data ) => {
            this.catalogs    = [];
            Object.keys( data )
            .forEach(( _catalog ) => {
                this.catalogs.push( data[ _catalog ]);
            });
        }); */
    }

    searchConfigByString( eve ){
        let val = eve.target.value;
        /* this.catalogService
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
                        this.catalogService
                        .put( item )
                        .subscribe(( response ) => {
                            this.getCatalogs();
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

    openNavDetailsConfig( item ){
        //this.navCtrl.push( EditConfigPage, { item: item });
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
