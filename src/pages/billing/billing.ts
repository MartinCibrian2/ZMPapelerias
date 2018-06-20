import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';
import { SelectSearchableComponent } from 'ionic-select-searchable';

import { CheckinService } from '../../providers/billing/checkin.service';
import { ClientService } from '../../providers/clients/client.service';
import { WayToPayService } from '../../providers/waytopay/way-to-pay.service';
import { AddClientPage } from '../configuracion/clients/add/add-client';
import { ConfiguracionPage } from '../configuracion/configuracion';

import sha256 from 'sha256';
import { AuthenticationService } from '../../providers/authentication.service';

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
  providers: [
    CheckinService,
    ClientService,
    WayToPayService
  ]
})

export class BillingPage implements OnInit
{
    public addClientPage = AddClientPage;
    public paramsClient  = { page: BillingPage };
    public tickets: any[] = new Array;
    public clients: any[] = new Array;
    public waystopay: any[] = new Array;
    // Form
    public checkinForm: FormGroup;
    public titlePage: string;
    public titleApp: string;
    public token: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public frmBuilder: FormBuilder,
        private checkingService: CheckinService,
        private clientService: ClientService,
        private waytopayService: WayToPayService,
        private _authService: AuthenticationService
    ) {
        this.titleApp      = "ZMPapelerias";
        this.titlePage     = "Registrar factura";
        this.token        = this._authService.getToken();
        this.checkinForm    = this.makeForm();
    }

    ngOnInit(){
        this.getTickets();
        this.getClients();
        this.getWaytoPay();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad BillingPage');
    }

    goAddClient(){
        this.navCtrl.setRoot( AddClientPage );
    }

    clientChange( event: { component: SelectSearchableComponent, value: any }){
        // Asigns the client selected.
        console.log('port:', event.value, this.checkinForm.value );
    }

    searchClients( event: { component: SelectSearchableComponent, text: string }) {
        let text = (event.text || '').trim().toLowerCase();

        if( !text ){
            event.component.items = this.clients;
            return;
        } else if ( event.text.length < 3 ){
            return;
        }

        event.component.isSearching = true;

        this.clientService
        .getClients( this.token )
        // .getClientsAsync( text )
        .subscribe( _clients => {
            event.component.items    = _clients.rows.map( row => {
                return row.doc;
            });
            event.component.isSearching = false;
        });
    }

    getTickets(){
        this.checkingService.getTickets()
        .then(
            _tickets => {
                this.tickets = _tickets;
            }
        );
    }

    getClients(){
        this.clientService
        .getClients( this.token )
        .subscribe(( data ) => {
            this.clients    = [];
            data.rows.map(( row ) => {
                this.clients.push( row.doc );
            });
        });
    }

    getWaytoPay(){
        this.waytopayService.getWaysToPay()
        .subscribe(( data ) => {
            data.c_FormaPago
            .forEach(( row, i ) => {
                if( row.active === true ){
                    this.waystopay.push( row );
                } else {
                    // The row is active equal false.
                }
            })
        });
    }

    makeBill(){
        let _form       = this.checkinForm.value;
        let _Tickets    = _form.tickets;
        // Con el uso de select
        /* this.clients.filter(( item ) => {
            if( item._id === _form.client ){
                _form.client    = item.nombre;
                _form.rfc       = item.rfc;
                return item;
            } else {
                // Continues searching.
            }
        }); */

        if( _Tickets.length ){
            /*let forJsonXml = new Array();
             _Tickets.forEach( _TicketId => {
                var ticketFound = this.tickets.find ( ticket => ticket._id == _TicketId );
                if( ticketFound && !ticketFound.is_checkin ){
                    //console.log( _TicketId, ticketFound );
                    forJsonXml.push( ticketFound );
                } else {
                    // It is ignored.
                }
            }); */
//console.log( _Tickets )
            if( _Tickets.length ){
                let _xml    = this.checkingService
                .prepareJsonForDocument( _Tickets );

                _xml["cfdi:Comprobante"]["cfdi:Receptor"]["@Nombre"]    = _form.client.nombre;
                _xml["cfdi:Comprobante"]["cfdi:Receptor"]["@Rfc"]       = _form.client.rfc;
                _xml["cfdi:Comprobante"]["@FormaPago"]                  = _form.waytopay;

                //this.checkingService.getOriginalString( _xml );

                let sXml    = Object.assign( {}, _xml["cfdi:Comprobante"] );
                delete sXml['@xmlns:cfdi'];
                delete sXml['@xmlns:xsi'];
                delete sXml['@xsi:schemaLocation'];
                delete sXml['@Certificado'];
                delete sXml['@Sello'];
console.log( sXml )
                sXml    = this.checkingService.getOriginalString( sXml );
console.log( sXml, sha256( sXml ))
                _xml    = this.checkingService
                .checking( _xml );

                if( _xml ){
                    this.navCtrl.setRoot( ConfiguracionPage );
                }
            } else {
                // It is show a message.
            }
        } else {
            // Must it show a message
        }
        //return this.checkingService.checking( this.detalleticket );
    }

    makeForm(){
        return this.frmBuilder.group({
            'client':  ['', [ Validators.required ]], //Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            //'rfc':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            //'date_deposit':  [ new Date(Date.now()).toISOString(), [ Validators.required, Validators.pattern( /^(\d{4})-(\d{1,2})-(\d{1,2})$/ )]],
            'waytopay':     ['', [ Validators.required ]],
            'tickets':     ['', [ Validators.required ]]
        });
    }

}
