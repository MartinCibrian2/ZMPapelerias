import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, LoadingController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SelectSearchableComponent } from 'ionic-select-searchable';

import { UserService } from '../../../../providers/users/users.service';
import { UsersPage } from '../users';
import { UploadService } from '../../../../providers/upload.service';
import { AclService } from '../../../../providers/users/acl.service';
import { AuthenticationService } from '../../../../providers/authentication.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: 'add-user.html',
  providers: [
      UserService,
      UploadService,
      AclService
  ]
})
export class AddUserPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public token: string;
    // Form
    public userForm: FormGroup;
    public user     = {};
    private item: any = {};
    public roles: any[] = new Array;
    public role: Observable< any >;

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
        this.getRoles();
        
        this.role    = this._aclService.getRoles( null ).pipe(
            tap( role => role )
        );
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddUserPage');
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

        /* this.clientService
        .getClientsAsync( text )
        .subscribe( _clients => {
            event.component.items    = _clients.rows.map( row => {
                return row.doc;
            });
            event.component.isSearching = false;
        }); */
    }

    roleChange( event: { component: SelectSearchableComponent, value: any }){
        // Asigns the client selected.
        // console.log('role:', event.value, this.userForm.value );
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
            'image':  [''],
            'active':  ['true'],
            'alive':  ['true']
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
