import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AppSettings } from '../../../app/common/api.path';
import { UserService } from '../../../providers/users/users.service';
import { UploadService } from '../../../providers/upload.service';

import { AddClientPage } from './add/add-client';
import { EditClientPage } from './edit/edit-client';

@IonicPage()
@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
    providers: [
        UserService,
        UploadService
    ]
})
export class UsersPage {
    public users    = [];
    public user     = {};
    public token: String;
    public searching;
    public optionsResult: any;
    // Form
    public userForm: FormGroup;
    public status;
    private apiPaths;
    private url: string;

    public addClientPage = AddClientPage;
    public paramsClient  = { page: UsersPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private _userService: UserService,
        private _uploadService: UploadService,
        public appSettings: AppSettings
    ){
        this.apiPaths    = appSettings.getPaths();
        this.url         = this.apiPaths.user;
    }

    ngOnInit(): void {
        // this.getUsers( );
    }

    onSubmit(){
        this._userService.addUser( this.token, this.userForm ).subscribe(
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
    }

    getUsers(){
        this._userService.getUsers( {} ).subscribe(
            response => {
                if( response.users ){
                    this.users    = response.users;
                } else {
                    // It is empty.
                }
            }, error => {
                console.log( <any> error )
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
            'email':  ['', [ Validators.required ]],
            //'tel':  ['', [ Validators.required, Validators.pattern( /^[0-9]{1,}$/ )]]
        };

        return this.frmBuilder.group( _group );
    }

}