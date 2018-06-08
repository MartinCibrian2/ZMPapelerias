import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { SelectSearchable } from 'ionic-select-searchable';

import { UserService } from '../../../../providers/users/users.service';
import { UsersPage } from '../users';
import { UploadService } from '../../../../providers/upload.service';
import { AclService } from '../../../../providers/users/acl.service';
import { AuthenticationService } from '../../../../providers/authentication.service';

class Role {
    public id: number;
    public name: string;
}

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
    // public roles: any[] = new Array;
    public roles: Role[];
    public role: Role;
    public status: String = "true";

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
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
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AddUserPage');
    }

    saveUser( ): void {
        if( this.userForm.valid ){
            var _doc       = this.userForm.value;
            _doc.active    = "true";

            this
            .userService
            .addUser( this.token, _doc )
            .subscribe(
                response => {
                    console.log( response )
                    if( response.user ){
                        this.status = 'success';
                        this.user = response.user;
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
                                console.log( result )
                                //this.user.image = result.user.image;
                                //   this._router.navigate(['/admin-panel/listado']);
                            });
                        } else {
                            // this._router.navigate(['/admin-panel/listado']);
                        }
                    } else {
                        this.status = 'error';
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    if( errorMessage != null ){
                        this.status = 'error';
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
                this.roles    = response.data;
            }
        );
    }

    public filesToUpload: Array< File >;
    fileChangeEvent( fileInput: any ){
        this.filesToUpload = <Array< File >> fileInput.target.files;
    }

    searchRoles( event: { component: SelectSearchable, text: string }) {
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

    roleChange( event: { component: SelectSearchable, value: any }){
        // Asigns the client selected.
        console.log('role:', event, this.userForm.value );
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

}
