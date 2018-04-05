import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../../providers/clients/client.service';
import { ClientsPage } from '../clients';

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'add-client.html',
  providers: [
      ClientService
  ]
})
export class AddClientPage implements OnInit
{
    public title: string;
    // Form
    public clientForm: FormGroup;
    public item: any;

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private clientService: ClientService
    ){
        this.title         = "Registrar";
        this.clientForm    = this.makeForm();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddClientPage');
    }

    saveClient( ): void {
        if( this.clientForm.valid ){
            var _doc   = this.clientForm.value;

            this.clientService
            .post( _doc )
            .then(( response ) => {
                console.log( JSON.stringify( response ))
                this.navCtlr.setRoot( ClientsPage );
            })
            .then(( error ) => {
                console.log( error );
            });
        } else {
            // The form is does not valid.
        }

        return;
    }

    makeForm( ){
        let _group    = {
            'nombre':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'rfc':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'tel':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]]
        };

        return this.frmBuilder.group( _group );
    }

}
