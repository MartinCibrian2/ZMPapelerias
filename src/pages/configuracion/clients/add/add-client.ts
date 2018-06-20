import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../../providers/clients/client.service';
import { ClientsPage } from '../clients';
import { UploadService } from '../../../../providers/upload.service';
import { AuthenticationService } from '../../../../providers/authentication.service';

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: 'add-client.html',
  providers: [
      ClientService,
      UploadService
  ]
})
export class AddClientPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public token: string;
    // Form
    public clientForm: FormGroup;
    public client: any;

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public frmBuilder: FormBuilder,
        private clientService: ClientService,
        private _uploadService: UploadService,
        private _authService: AuthenticationService
    ){
        this.titleApp      = "ZMPapelerias";
        this.titlePage     = "Registrar cliente";
        this.clientForm    = this.makeForm();
        this.token         = this._authService.getToken();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad AddClientPage');
    }

    saveClient( ): void {
        if( this.clientForm.valid ){
            var _doc       = this.clientForm.value;
            _doc.active    = "true";

            let load    = this.loadingCtrl.create();
            load.present( load );

            this
            .clientService
            .add( this.token, _doc )
            .subscribe(
                response => {
                    if( response.client ){
                        this.client    = response.client;
                        if( this.filesToUpload ){
                        // Upload Image
                            this._uploadService
                            .makeFileRequest(
                                'upload-image-client/' + this.client["_id"],
                                [],
                                this.filesToUpload,
                                this.token,
                                'image'
                            ).then(( result: any ) => {
                                console.log( result );
                                load.dismiss();
                                this.showAlertCode( response );
                                this.navCtrl.setRoot( ClientsPage );
                            })
                            .catch(( error ) => {
                                load.dismiss();
                                this.showAlertCode( error );
                            });
                        } else {
                            load.dismiss();
                            this.showAlertCode( response );
                            this.navCtrl.setRoot( ClientsPage );
                        }
                    } else {
                        load.dismiss();
                        this.showAlertCode( response );
                        this.navCtrl.setRoot( ClientsPage );
                    }
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

    public filesToUpload: Array< File >;
    fileChangeEvent( fileInput: any ){
        console.log( fileInput )
        this.filesToUpload = <Array< File >> fileInput.target.files;
    }

    makeForm( ){
        let _group    = {
            'name':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'rfc':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'phone':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]]
        };

        return this.frmBuilder.group( _group );
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

}
