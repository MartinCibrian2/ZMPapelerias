import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ConfigsService } from '../../../../providers/configs/configs.service';

import { AddCatalogPage } from './add/add-catalog';
import { AuthenticationService } from '../../../../providers/authentication.service';
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
    public titlePage: string;
    public titleApp: string;
    public token: string;
    public nameField: string;
    public catalogs    = [];
    public searching;
    public optionsResult: any;

    public addCatalogPage = AddCatalogPage;
    public paramsCatalog  = { page: CatalogsPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private configService: ConfigsService,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private _authService: AuthenticationService
    ){
        this.titleApp      = "ZMPapelerias";
        this.titlePage     = "Registrar Catalogo";
        this.token         = this._authService.getToken();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ConfigsPage');
    }

    ngOnInit(): void {
        let _params    = this.navParams.data;

        if( Object.keys( _params ).length ){
            if( _params.hasOwnProperty('catalog')){
                this.nameField    = _params.catalog;
                this.getCatalog( _params.catalog );
                this.postCatalog()
            }
        }
    }

    getCatalog( _catalog: string ){
        this.configService
        .get( this.token )
        .subscribe(( data ) => {
            this.catalogs    = data[ _catalog ];
        });
    }

    postCatalog(){
        let _doc = {
            c_Moneda: "ARG",
            Descripción: "Peso Argentino",
            Decimales: 2,
            "Porcentaje variación": "35%"
        };
        /* this.configService.post( _doc ).subscribe(( response ) => {
            console.log( response )
        }, ( error ) => {
            console.log( error )
        }); */
    }

    searchByString( eve ){
        let val = eve.target.value;
        /* this.catalogService
        .searchConfigByString( val )
        .subscribe(( data ) => {
            this.configs = data.rows.map( row => {
                return row.doc;
            });
        }); */
    }

    delete( item: any): void {
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

    openNavDetailsCatalog( item ){
        //this.navCtrl.push( EditCatalogPage, { item: item });
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
