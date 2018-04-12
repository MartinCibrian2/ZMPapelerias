import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { CheckinService } from '../../../../providers/billing/checkin.service';
import { ConfigsService } from '../../../../providers/configs/configs.service';
import { ConfigsPage } from '../configs';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: '../add/add-config.html',
  providers: [
      ConfigsService
  ]
})
export class EditConfigPage implements OnInit
{
    public title: string;
    // Form
    public configForm: FormGroup;
    public item: any;
    public claveProdServs: any = new Array();
    public optionsResult: any;

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private configService: ConfigsService,
        private checkinService: CheckinService
    ){
        this.title      = "Actualizar";
        // this.configForm    = this.makeForm();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad EditSellPage');
    }

    ngOnInit(){
        // this.getClaveProdServs();
    }
  
    getClaveProdServs(){
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
    }

    saveConfig( ): void {
        if( this.configForm.valid ){
            var _doc   = this.configForm.value;

            _doc.active    = true;
            this.configService
            .put( _doc )
            .subscribe(( response ) => {
                if( response.ok ){
                    this.configForm.reset();
                    this.navCtlr.setRoot( ConfigsPage );
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

        if( Object.keys( this.navParams.data ).length ){
            if( this.navParams.data.hasOwnProperty('item') ){
                this.item    = this.navParams.data.item;

                Object
                .keys( this.item )
                .forEach(( _field ) => {
                    let _val    = this.item[ _field ];
                    _group[ _field ]   = _val;
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
