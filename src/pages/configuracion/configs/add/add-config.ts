import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ConfigsService } from '../../../../providers/configs/configs.service';
import { CheckinService } from '../../../../providers/billing/checkin.service';
import { ConfigsPage } from '../configs';
import { AuthenticationService } from '../../../../providers/authentication.service';

@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'add-config.html',
  providers: [
      ConfigsService
  ]
})
export class AddConfigPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public token: string;
    // Form
    public configForm: FormGroup;
    public claveProdServs: any = new Array();

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public frmBuilder: FormBuilder,
        private configsService: ConfigsService,
        private checkinService: CheckinService,
        private _authService: AuthenticationService
    ){
        this.titleApp      = "ZMPapelerias";
        this.titlePage     = "Registrar Catalogo";
        this.configForm    = this.makeForm();
        this.token         = this._authService.getToken();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad AddSellsPage');
    }

    ngOnInit(){
        //this.getClaveProdServs();
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
            var _doc       = this.configForm.value;
            _doc.active    = "true";

            let load    = this.loadingCtrl.create();
            load.present( load );

            this
            .configsService
            .add( _doc, this.token )
            .subscribe(
                response => {
                    load.dismiss();
                    this.showAlertCode( response );
                    this.navCtrl.setRoot( ConfigsPage );
                },
                error => {
                    var errorMessage = <any>error;
                    if( errorMessage != null ){
                        load.dismiss();
                        this.showAlertCode( error );
                    }
                }
            );
        } else {
            // The form is does not valid.
        }
    }

    showAlertCode( _body: any ){
    let alert = this.alertCtrl.create({ 
        title: _body.title,
        subTitle: _body.message,
        buttons: [{
          text: _body.text,
          handler: data => {
                    if( _body.hasOwnProperty('callback')){
                        _body.callback();
                    }
                }
            }]
        });
    
        alert.present();
        alert.onDidDismiss(
            data => {
                console.log('Closed');
            }
        )
    }

    makeForm( ){
        let _group    = {
            'name':  ['', [ Validators.required, Validators.minLength( 2 ) ]], // pattern( /^[a-zA-Z0-9_ ]*$/ )
            'description':  ['', [ ]],
            // 'unidad':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            // 'preciopublico':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'costo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'descuentomayoreo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'descuentomaximo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'mayoreo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'iva':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'inventariominimo':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'inventarioactual':  ['', [ Validators.required, Validators.pattern( /^[0-9.]{1,}$/ )]],
            // 'claveProdServ':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]]
        };

        return this.frmBuilder.group( _group );
    }

}
