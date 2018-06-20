import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, LoadingController, AlertController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { ClientService } from '../../../../providers/clients/client.service';
import { ClientsPage } from '../clients';
import { AuthenticationService } from '../../../../providers/authentication.service';
import { UploadService } from '../../../../providers/upload.service';

@IonicPage()
@Component({
  selector: 'page-client',
  templateUrl: '../add/add-client.html',
  providers: [
      ClientService,
      UploadService
  ]
})
export class EditClientPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public token: string;
    // Form
    public clientForm: FormGroup;
    public item: any;

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public frmBuilder: FormBuilder,
        private _authService: AuthenticationService,
        private _uploadService: UploadService,
        private clientService: ClientService
    ){
        this.titleApp      = "ZMPapelerias";
        this.titlePage     = "Registrar Usuario";
        this.token         = this._authService.getToken();
        this.clientForm    = this.makeForm();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad EditClientPage');
    }

    saveClient( ): void {
        if( this.clientForm.valid ){
            var _doc       = this.clientForm.value;
            _doc.active    = "true";

            let load    = this.loadingCtrl.create();
            load.present( load );

            this
            .clientService
            .edit( _doc, this.token )
            .subscribe(
                response => {
                    console.log( response )
                    if( response.client ){
                        let _client      = response.client;
                        load.dismiss();
                        this.showAlertCode( response );
                        this.navCtrl.setRoot( ClientsPage );
                        /* if( this.filesToUpload ){
                            // Upload Image
                            this._uploadService
                            .makeFileRequest(
                                'upload-image-client/' + _client['_id'],
                                [],
                                this.filesToUpload,
                                this.token,
                                'image'
                            ).then(( result: any ) => {
                                console.log( result );
                                if( _doc['image'].length && result ){
                                    this._uploadService
                                    .removeFileAtt(
                                        'remove-image-client/' + _client['_id'] +'/'+ _doc['image'],
                                        this.token
                                    ).subscribe(
                                        ( _result: any ) => {
                                            console.log( _result )
                                            load.dismiss();
                                            this.showAlertCode( response );
                                            this.navCtrl.setRoot( ClientsPage );
                                        }, error => {
                                            load.dismiss();
                                            this.showAlertCode( error );
                                        }
                                    );
                                } else {
                                    // It is new.
                                    load.dismiss();
                                    this.showAlertCode( response );
                                    this.navCtrl.setRoot( ClientsPage );
                                }

                            })
                            .catch(( error ) => {
                                load.dismiss();
                                this.showAlertCode( error );
                            });
                        } else {
                            load.dismiss();
                            this.showAlertCode( response );
                            this.navCtrl.setRoot( ClientsPage );
                        } */
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

        return;
    }

    public filesToUpload: Array< File >;
    fileChangeEvent( fileInput: any ){
        console.log( fileInput )
        this.filesToUpload = <Array< File >> fileInput.target.files;
    }

    makeForm( ){
        let data      = this.navParams.data;
        let _group    = {
            'id': ['', Validators.required ],
            'name':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'rfc':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'phone':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]]
        };

        if( Object.keys( data ).length ){
            if( data.hasOwnProperty('item') ){
                this.item    = data.item;
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
