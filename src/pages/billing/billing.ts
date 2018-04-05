import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CheckinService } from '../../providers/billing/checkin.service';

@IonicPage()
@Component({
  selector: 'page-billing',
  templateUrl: 'billing.html',
  providers: [
    CheckinService
  ]
})
export class BillingPage implements OnInit {
    public tickets: any[] = new Array;
    // Form
    public checkinForm: FormGroup;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public frmBuilder: FormBuilder,
        private checkingService: CheckinService
    ) {
        this.checkinForm    = this.makeForm();
    }

    ngOnInit(){
        this.getTickets();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad BillingPage');
    }

    getTickets(){
        this.checkingService.getTickets()
        .then(
            _tickets => {
                this.tickets = _tickets;
            }
        );
    }

    makeBill(){
        let _Tickets = this.checkinForm.value.tickets;

        if( _Tickets.length ){
            let forJsonXml = new Array();
            _Tickets.forEach( _TicketId => {
                var ticketFound = this.tickets.find ( ticket => ticket._id == _TicketId );
                if( ticketFound && !ticketFound.is_checkin ){
                    //console.log( _TicketId, ticketFound );
                    forJsonXml.push( ticketFound );
                } else {
                    // It is ignored.
                }
            });

            if( forJsonXml.length ){
                let _xml    = this.checkingService
                .prepareJsonForDocument( forJsonXml );

                _xml["cfdi:Comprobante"]["cfdi:Receptor"]["@Nombre"]    = this.checkinForm.value.client;
                _xml["cfdi:Comprobante"]["cfdi:Receptor"]["@Rfc"]       = this.checkinForm.value.rfc;

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
            'client':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'rfc':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            //'date_deposit':  [ new Date(Date.now()).toISOString(), [ Validators.required, Validators.pattern( /^(\d{4})-(\d{1,2})-(\d{1,2})$/ )]],
            'tickets':     ['', [ Validators.required ]]
        });
    }

}
