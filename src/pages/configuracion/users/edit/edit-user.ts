import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../../../providers/users/users.service';
import { UsersPage } from '../users';
import { AuthenticationService } from '../../../../providers/authentication.service';
import { AclService } from '../../../../providers/users/acl.service';
import { UploadService } from '../../../../providers/upload.service';
import { SelectSearchableComponent } from 'ionic-select-searchable';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: '../add/add-user.html',
  providers: [
      UserService,
      UploadService,
      AclService
  ]
})
export class EditUserPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public token: string;
    // Form
    public userForm: FormGroup;
    public roles: any[] = new Array;
    private item: any;

    constructor(
        public navParams: NavParams,
        public navCtrl: NavController,
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public frmBuilder: FormBuilder,
        private userService: UserService,
        private _uploadService: UploadService,
        private _aclService: AclService,
        private _authService: AuthenticationService
    ){
        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Registrar Usuario";
        this.token        = this._authService.getToken();
        this.userForm     = this.makeForm();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EdituserPage');
    }

    saveUser( ): void {
        if( this.userForm.valid ){
            var _doc       = this.userForm.value;
            _doc.active    = "true";

            if( typeof _doc.role === 'string' ){
                // The role content is a string.
            } else {
                _doc.role    = _doc.role.name;
            }

            let load    = this.loadingCtrl.create();
            load.present( load );

            this
            .userService
            .addUser( this.token, _doc )
            .subscribe(
                response => {
                    console.log( response )
                    if( response.user ){
                        this.status    = 'success';
                        this.user      = response.user;
                        if( this.filesToUpload ){
                        // Upload Image
                            this._uploadService
                            .makeFileRequest(
                                'upload-image-user/' + this.user["_id"],
                                [],
                                this.filesToUpload,
                                this.token,
                                'image'
                            ).then(( result: any ) => {
                                console.log( result );
                                load.dismiss();
                                this.showAlertCode( response );
                                this.navCtrl.setRoot( UsersPage );
                            })
                            .catch(( error ) => {
                                load.dismiss();
                                this.showAlertCode( error );
                            });
                        } else {
                            load.dismiss();
                            this.showAlertCode( response );
                            this.navCtrl.setRoot( UsersPage );
                        }
                    } else {
                        load.dismiss();
                        this.showAlertCode( response );
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

    getRoles(){
        this._aclService.getRoles( null )
        .subscribe(
            response    => {
                this.roles    = [];
                response.data.map(( row ) => {
                    this.roles.push( row );
                });
            }
        );
    }

    public filesToUpload: Array< File >;
    fileChangeEvent( fileInput: any ){
        console.log( fileInput )
        this.filesToUpload = <Array< File >> fileInput.target.files;
    }

    searchRoles( event: { component: SelectSearchableComponent, text: string }) {
        let text = ( event.text || '').trim().toLowerCase();

        if( !text ){
            event.component.items = this.roles;
            return;
        } else if ( event.text.length < 3 ){
            return;
        }

        event.component.isSearching = true;

    }

    roleChange( event: { component: SelectSearchableComponent, value: any }){
        // Asigns the client selected.
        this.userForm.value.role    = event.value.name;
    }

    makeForm( ){
        let _group    = {
            'name':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'surname':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'username':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'password':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'email':  ['', [ Validators.required, Validators.email ]],
            'job':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'role':  ['', [ Validators.required ]],
            'image':  ['']
        };

        if( Object.keys( this.navParams.data ).length ){
            if( this.navParams.data.hasOwnProperty('item') ){
                this.item    = this.navParams.data.item;
                Object
                .keys( this.item )
                .forEach(( _field ) => {
                    let _val    = this.item[ _field ];
console.log( _field, _val )
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
