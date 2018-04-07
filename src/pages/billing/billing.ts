import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SelectSearchable } from 'ionic-select-searchable';

import { CheckinService } from '../../providers/billing/checkin.service';
import { ClientService } from '../../providers/clients/client.service';

class Port {
    public id: number;
    public name: string;
}

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
  providers: [
    CheckinService,
    ClientService
  ]
})

export class BillingPage implements OnInit {
    ports: Port[];
    port: Port;

    public tickets: any[] = new Array;
    public clients: any[] = new Array;
    // Form
    public checkinForm: FormGroup;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public frmBuilder: FormBuilder,
        private checkingService: CheckinService,
        private clientService: ClientService
    ) {
        this.checkinForm    = this.makeForm();
    }

    ngOnInit(){
        this.getTickets();
        this.getClients();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BillingPage');
    }

    clientChange( event: { component: SelectSearchable, value: any }){
        // Asigns the client selected.
        //console.log('port:', event.value, this.checkinForm.value );
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
        .getClients()
        .then(( data ) => {
            this.clients = [];
            data.rows.map(( row ) => {
                this.clients.push( row.doc );
            });
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
console.log( _form, _Tickets )
            if( _Tickets.length ){
                let _xml    = this.checkingService
                .prepareJsonForDocument( _Tickets );

                _xml["cfdi:Comprobante"]["cfdi:Receptor"]["@Nombre"]    = _form.client.nombre;
                _xml["cfdi:Comprobante"]["cfdi:Receptor"]["@Rfc"]       = _form.client.rfc;

                this.checkingService
                .checking( _xml );
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
            'tickets':     ['', [ Validators.required ]]
        });
    }

}
