import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BuysService } from '../../../providers/buys/buys.service';

import { AddBuyPage } from './add/add-buy';
import { EditBuyPage } from './edit/edit-buy';

@IonicPage()
@Component({
    selector: 'page-buys',
    templateUrl: 'buys.html',
    providers: [
        BuysService
    ]
})
export class BuysPage {
    public buys = [];
    public searching;
    public optionsResult: any;

    // For sync
    remoteCouchDbAddress: string;
    syncStatus: boolean;
    couchDbUp: boolean;

    public addBuyPage = AddBuyPage;
    public paramsBuy  = { page: BuysPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private buyService: BuysService,
        private ngZone: NgZone,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ){
        this.buyService.syncStatus
        .subscribe(( result ) => {
            this.syncStatus    = result;
        });
        this.buyService.couchdbUp
        .subscribe(( result ) => {
            this.couchDbUp     = result;
        });

        this.remoteCouchDbAddress    = this.buyService.buyUrl;
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad BuysPage');
    }

    ngOnInit(): void {
        this.getBuys( );
    }

    searchBuyByString( eve ){
        let val = eve.target.value;
        this.buyService
        .searchBuyByString( val )
        .subscribe(( data ) => {
            this.buys = data.rows.map( row => {
                return row.doc;
            });
        });
    }

    getBuys(){
        this.buyService
        .getBuys( {} )
        .subscribe(( data ) => {
            this.buys = [];
            data.rows.map(( row ) => {
                this.buys.push( row.doc );
            });
        });
    }

    deleteBuy( item: any): void {
        this.optionsResult    = {
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
                        this.buyService
                        .put( item )
                        .subscribe(( response ) => {
                            this.getBuys();
                            this.presentToast( this.optionsResult );
                        },
                        ( error ) => {
                            console.log( error );
                        });
                     }
                }
            ]
        });
        confirm.present();
    }

    openNavDetailsBuy( item ){
        this.navCtrl.push( EditBuyPage, { item: item });
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
