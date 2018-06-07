import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../../../providers/users/users.service';
import { UsersPage } from '../users';
import { UploadService } from '../../../../providers/upload.service';
import { AclService } from '../../../../providers/users/acl.service';

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
    public token: String;
    // Form
    public userForm: FormGroup;
    public item: any;
    public user     = {};
    public roles    = [];
    public status: boolean = true;

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private userService: UserService,
        private _uploadService: UploadService,
        private _aclService: AclService
    ){
        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Registrar Usuario";
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
            _doc.active    = true;

            this
            .userService
            .addUser( this.token, this.userForm )
            .subscribe(
                response => {
                    console.log( response )
                    if( response.user ){
                        this.status = 'success';
                        this.user = response.user;
                        /* if( this.filesToUpload ){
                        // Upload Image
                        this._uploadService.makeFileRequest(
                            this.url + 'upload-image-user/' + this.user._id,
                            [],
                            this.filesToUpload,
                            this.token,
                            'image'
                        ).then(( result: any ) => {
                            this.user.image = result.user.image;
                            //   this._router.navigate(['/admin-panel/listado']);
                        });
                        } else {
                            // this._router.navigate(['/admin-panel/listado']);
                        } */
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

        return;
    }

    getRoles(){
        this._aclService.getRoles( null )
        .subscribe(
            response    => {
                console.log( response )
                this.roles    = response.data;
            }
        );
    }

    public filesToUpload: Array< File >;
    fileChangeEvent( fileInput: any ){
        this.filesToUpload = <Array< File >> fileInput.target.files;
    }

    makeForm( ){
        let _group    = {
            'name':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'surname':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'username':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'password':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'email':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'job':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            //'role':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'active':  ['']
        };

        return this.frmBuilder.group( _group );
    }

}
