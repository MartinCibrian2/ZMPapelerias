import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../providers/clients/client.service';

import { AddClientPage } from './add/add-client';
import { EditClientPage } from './edit/edit-client';

@IonicPage()
@Component({
  selector: 'page-clients',
  templateUrl: 'clients.html',
  providers: [
      ClientService
  ]
})
export class ClientsPage {
    public clients = [];
    public _clients = [];
    public searching;
    public optionsResult: any;

    // For sync
    remoteCouchDbAddress: string;
    dataPouchdbString: string;
    syncStatus: boolean;
    couchDbUp: boolean;

    public addClientPage = AddClientPage;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        private clientService: ClientService,
        private ngZone: NgZone,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController
    ){
        this.clientService.syncStatus
        .subscribe(( result ) => {
            this.syncStatus    = result;
        });
        this.clientService.couchdbUp
        .subscribe(( result ) => {
            this.couchDbUp     = result;
        });

        this.remoteCouchDbAddress    = this.clientService.clientsUrl;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ClientsPage');
    }

    ngOnInit(): void {
        this.getClients();
    }

    searchItems2( eve ){
        let val = eve.target.value;
        this.clientService.BuscarProductos( val );
        console.log( val )
    }

    getClients(){
        this.clientService
        .getClients()
        .then(( data ) => {
            this.dataPouchdbString    = JSON.stringify( data.rows, undefined, 2 );
            this.clients = [];
            data.rows.map(( row ) => {
                this.clients.push( row.doc );
                this._clients.push( row.doc );
            });
        });
    }

    deleteClient( item: any): void {
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
                        this.clientService
                        .put( item )
                        .then(( response ) => {
                            this.getClients();
                            this.presentToast( this.optionsResult );
                        })
                        .catch(( error ) => {
                            console.log( error );
                        });
                        // Delete forever.
                        /* this.clientService
                        .delete( item )
                        .then(( response ) => {
                             this.getClients();
                             // this.navCtrl.popToRoot();
                             this.presentToast( this.optionsResult );
                        })
                        .catch(( error ) => {
                            console.log( error );
                        }); */
                    }
                }
            ]
        });
        confirm.present();
    }

    openNavDetailsClient( item ){
        this.navCtrl.push( EditClientPage, { item: item });
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




    /* searchItems( ev: any ){
        // Reset items back to all of the items
        this.clients    = this._clients;
        // set val to the value of the searchbar
        let val = ev.target.value;
        // if the value is an empty string don't filter the items
        if( val && val.trim() != '' ){
            this.clients = this._clients.filter(( item ) => {
                let _title    = this.existsWord( val, item.nombre ),
                    _rfc      = this.existsWord( val, item.rfc );

                _title    = _title || _rfc;

                return _title;
            })
        }

        existsWord( search: string, stack: any ){
            return ( stack.toLowerCase().indexOf( search.toLowerCase() ) > -1 );
        }
    */
