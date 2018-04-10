import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { BuysService } from '../../../../providers/buys/buys.service';
import { BuysPage } from '../buys';

@IonicPage()
@Component({
  selector: 'page-buy',
  templateUrl: 'add-buy.html',
  providers: [
      BuysService
  ]
})
export class AddBuyPage implements OnInit
{
    public title: string;
    // Form
    public buyForm: FormGroup;

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private buysService: BuysService
    ){
        this.title      = "Registrar";
        this.buyForm    = this.makeForm();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddSellsPage');
    }

    saveBuy( ): void {
        //if( this.buyForm.valid ){
            //var _doc   = this.buyForm.value;

            /* this.sellsService
            .post( _doc )
            .then(( response ) => {
                let _page = this.navParams.data.page;
                this.navCtlr.setRoot( _page );
                // this.navCtlr.popToRoot( );
            })
            .catch(( error ) => {
                console.log( error );
            }); */
        //} else {
            // The form is does not valid.
        //}

        return;
    }

    makeForm( ){
        let _group    = {
            'nombre':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'descripcion':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'unidad':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'preciopublico':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'costo':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'descuentomayoreo':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'descuentomaximo':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'mayoreo':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'iva':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'inventariominimo':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'inventarioactual':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]],
            'claveProdServ':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]]
        };

        return this.frmBuilder.group( _group );
    }

}
