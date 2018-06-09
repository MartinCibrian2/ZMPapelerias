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
    public titlePage: string;
    public titleApp: string;
    public users    = [];
    public user     = {};
    public token: String;
    public searching;
    public optionsResult: any;
    // Form
    public userForm: FormGroup;
    public status;
    private apiPaths;
    public url: string;

    public addUserPage    = AddUserPage;
    public paramsUser     = { page: UsersPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private _userService: UserService,
        private _uploadService: UploadService,
        public appSettings: AppSettings
    ){
        this.url    = appSettings.path_api;

        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Usuarios";
    }

    ngOnInit(): void {
        this.getUsers( );
    }

    getUsers(){
        this._userService.getUsers( null )
        .subscribe(
            response => {
                if( response.data ){
                    this.users    = response.data;
                } else {
                    // It is empty.
                }
            }, error => {
                console.log( <any> error )
            }
        );
    }

    deleteUser( item: any): void {
        this.optionsResult    = {
            "message": item.email + " se ha eliminado",
            "duration": 5000,
            "position": 'bottom'
        }

        let confirm = this.alertCtrl.create({
            title: "Seguro de eliminar " + item.email + " ?",
            message: "Si acepta eliminar " + item.email + " ya no podrá recuperarlo.",
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        this.optionsResult.message    = "Se Canceló Eliminar " + item.email;
                        this.presentToast( this.optionsResult );
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        // Action delete item.
                        item.active    = false;
                        /* this._userService
                        .put( item )
                        .then(( response ) => {
                            this.getClients();
                            this.presentToast( this.optionsResult );
                        })
                        .catch(( error ) => {
                            console.log( error );
                        }); */
                        // Delete forever.
                        /* this.clientService
                        .delete( item )
                        .then(( response ) => {
                             this.getClients();
                             // this.navCtrl.popToRoot();
                             this.presentToast( this.optionsResult );
                        })
                        .catch(( error ) => {
                            console.log( error );
                        }); */
                    }
                }
            ]
        });
        confirm.present();
    }

    openNavDetails( item ){
        this.navCtrl.push( EditUserPage, { item: item });
    }

    presentToast( _options: any ): void {
        let _default    = {
            message: 'Action completed',
            duration: 3000
        };

        if( Object.keys( _options ).length ){
            // Contains values.
        } else {
            _options    = Object.create( _default );
        }

        let toast = this.toastCtrl.create( _options );
        toast.present();
    }

}