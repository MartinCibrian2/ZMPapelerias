import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BuysService } from '../../../../providers/buys/buys.service';
import { BuysPage } from '../buys';

@IonicPage()
@Component({
  selector: 'page-buy',
  templateUrl: '../add/add-buy.html',
  providers: [
      BuysService
  ]
})
export class EditBuyPage implements OnInit
{
    public title: string;
    // Form
    public sellForm: FormGroup;
    public item: any;

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private sellService: BuysService
    ){
        this.title       = "Actualizar";
        this.sellForm    = this.makeForm();
    }

    ngOnInit(){
        
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EditSellPage');
    }

    saveSell( ): void {
        if( this.sellForm.valid ){
            var _doc   = this.sellForm.value;

            _doc.active    = true;
            this.sellService
            .put( _doc )
            /* .then(( response ) => {
                this.navCtlr.setRoot( SellsPage );
            })
            .then(( error ) => {
                console.log( error );
            }); */
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
