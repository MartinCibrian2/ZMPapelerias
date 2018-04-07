import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../../providers/clients/client.service';
import { ClientsPage } from '../clients';

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: '../add/add-client.html',
  providers: [
      ClientService
  ]
})
export class EditClientPage implements OnInit
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
        this.title         = "Actualizar";
        this.clientForm    = this.makeForm();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditClientPage');
    }

    saveClient( ): void {
        if( this.clientForm.valid ){
            var _doc   = this.clientForm.value;

            _doc.active    = true;
            this.clientService
            .put( _doc )
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

        if( Object.keys( this.navParams.data ).length ){
            if( this.navParams.data.hasOwnProperty('item') ){
                this.item    = this.navParams.data.item;
                Object
                .keys( this.item )
                .forEach(( _field ) => {
                    //if( _group.hasOwnProperty( _field )){
                        let _val    = this.item[ _field ];
                        _group[ _field ]   = _val;
                    /*} else {
                        // The name field does not exist in form.
                    }*/
                });
            } else {
                // Do not sent data.
            }
        } else {
            // Do not sent data.
        }

        return this.frmBuilder.group( _group );
    }

}
