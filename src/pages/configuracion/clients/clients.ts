import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../providers/clients/client.service';
import { ClientModel } from '../../../app/models/client.model';
import { ClientPage } from './client/client';
import { AddClientPage } from './add/add-client';

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
            console.log( result )
            this.syncStatus    = result;
        });
        this.clientService.couchdbUp
        .subscribe(( result ) => {
            this.couchDbUp     = result;
        });
console.log( this.clientService.clientsUrl )
        this.remoteCouchDbAddress    = this.clientService.clientsUrl;

        //this.clientService.getClients();
        //this.initializeItems();
    }

    ngOnInit(): void {
        this.getClients();
    }

    /*initializeItems(){
        this.items = [
          {
            'title': 'Angular',
            'icon': 'angular',
            'description': 'A powerful Javascript framework for building single page apps. Angular is open source, and maintained by Google.',
            'color': '#E63135'
          },
          {
            'title': 'CSS3',
            'icon': 'css3',
            'description': 'The latest version of cascading stylesheets - the styling language of the web!',
            'color': '#0CA9EA'
          },
          {
            'title': 'HTML5',
            'icon': 'html5',
            'description': 'The latest version of the web\'s markup language.',
            'color': '#F46529'
          }
        ];
    }*/

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
            console.log('getClients')
        });
    }

    addClient(){}

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
    } */

    existsWord( search: string, stack: any ){
        return ( stack.toLowerCase().indexOf( search.toLowerCase() ) > -1 );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ClientsPage');
    }

    openNavDetailsClient( item ){
        this.navCtrl.push( ClientPage, { item: item });
    }

}
