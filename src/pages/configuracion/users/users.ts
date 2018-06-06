import { Component, OnInit, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AppSettings } from '../../../app/common/api.path';
import { UserService } from '../../../providers/users/users.service';
import { UploadService } from '../../../providers/upload.service';

import { AddUserPage } from './add/add-user';
import { EditUserPage } from './edit/edit-user';

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

    public addClientPage = AddUserPage;
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

}