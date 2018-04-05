import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../providers/clients/client.service';
import { ClientModel } from '../../../app/models/client.model';

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
    public clientModel: ClientModel;
    public clients = [];
    public _clients = [];
    public searching;
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
        private ngZone: NgZone
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

    openNavDetailsClient( item ){
        this.navCtrl.push( EditClientPage, { item: item });
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
    } */
