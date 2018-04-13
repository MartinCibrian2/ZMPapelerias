import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ConfigsService } from '../../../../../providers/configs/configs.service';
//import { CheckinService } from '../../../../providers/billing/checkin.service';
import { CatalogsPage } from '../catalogs';

@IonicPage()
@Component({
  selector: 'page-catalog',
  templateUrl: 'add-catalog.html',
  providers: [
      ConfigsService
  ]
})
export class AddCatalogPage implements OnInit
{
    public title: string;
    // Form
    public catalogForm: FormGroup;
    public claveProdServs: any = new Array();

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private catalogService: ConfigsService,
        //private checkinService: CheckinService
    ){
        this.title         = "Registrar";
        //this.catalogForm    = this.makeForm();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad AddSellsPage');
    }

    ngOnInit(){
        //this.getClaveProdServs();
    }
  
    /* getClaveProdServs(){
        this.checkinService
        .getCatalogClaveProdServs()
        .subscribe(
            response => {
                if( response.c_ClaveProdServ ){
                    this.claveProdServs = response.c_ClaveProdServ;
                } else {
                    console.log( response );
                }
            },
            error => {
                console.log( <any> error );
            }
        );
    } */

    saveConfig( ): void {
        if( this.catalogForm.valid ){
            var _doc       = this.catalogForm.value;
            _doc.active    = true;

            this.catalogService
            .post( _doc )
            .subscribe(( response ) => {
                let _page = this.navParams.data.page;

                if( response.ok ){
                    this.catalogForm.reset();
                    this.navCtlr.setRoot( _page );
                } else {
                    // It does not add the item.
                }
            }, ( error ) => {
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
            'descripcion':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'unidad':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'preciopublico':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'costo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'descuentomayoreo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'descuentomaximo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'mayoreo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'iva':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'inventariominimo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'inventarioactual':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            'claveProdServ':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]]
        };

        return this.frmBuilder.group( _group );
    }

}
