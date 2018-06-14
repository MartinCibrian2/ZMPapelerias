import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';

import { AppSettings } from '../../../app/common/api.path';
import { UserService } from '../../../providers/users/users.service';
import { AuthenticationService } from '../../../providers/authentication.service';

import { AddUserPage } from './add/add-user';
import { EditUserPage } from './edit/edit-user';

@IonicPage()
@Component({
    selector: 'page-users',
    templateUrl: 'users.html',
    providers: [
        UserService,
        AuthenticationService
    ]
})
export class UsersPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public users    = [];
    public user     = {};
    public token: string;
    public searching;
    public optionsResult: any;
    public status;
    public notice: string = '';
    public url: string;

    public addUserPage    = AddUserPage;
    public paramsUser     = { page: UsersPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private _userService: UserService,
        private _authService: AuthenticationService,
        private appSettings: AppSettings
    ){
        this.url    = appSettings.path_api;

        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Usuarios";
        this.token        = this._authService.getToken();
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

    searchUserByString( event ){
        var _searching    = event.target.value;

        if(  typeof _searching !== "undefined" ){
            if( _searching.length > 2 ){
                this.notice    = '';
                let fields    = {
                    name:    _searching,
                    surname: _searching,
                    email:   _searching
                };

                this._userService
                .searchUsers( fields, this.token )
                .subscribe(
                    ( response: any ) => {
                        if( response.data.length ){
                            this.users    = [];
                            response.data.forEach(( row )=> {
                                this.users.push( row );
                            });
                        } else {
                            // There are not data.
                            this.notice = 'No existe información!';
                        }
                    }, error => {
                        console.log( error )
                    }
                );
            } else {
                this.notice    = 'Ingrese mas de 3 caracteres';
                this.getUsers();
            }
        } else {
            this.getUsers();
        }
    }

    deleteUser( item: any): void {
        this.optionsResult    = {
            "message": item.name + ' ' + item.surname + " se ha eliminado",
            "duration": 5000,
            "position": 'bottom'
        }

        let confirm = this.alertCtrl.create({
            title: "Seguro de eliminar " + item.name + ' ' + item.surname + " ?",
            message: "Si acepta eliminar " + item.name + ' ' + item.surname + " ya no podrá recuperarlo.",
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        this.optionsResult.message    
                        = "Se Canceló Eliminar " + item.name + ' ' + item.surname;
                        this.presentToast( this.optionsResult );
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        // Action delete item.
                        item.alive    = !item.alive;
                        this
                        ._userService
                        .editUser( this.token, item )
                        .subscribe(
                            response => {
                                this.getUsers();
                                this.presentToast( this.optionsResult );
                            },
                            error => {
                                console.log( error );
                                var errorMessage    = <any>error;
                                if( errorMessage != null ){
                                    this.presentToast( errorMessage );
                                }
                            }
                        );
                    }
                }
            ]
        });
        confirm.present();
    }

    activeUser( item: any ): void {
        // Action active item.
        item.active    = !item.active;
        this
        ._userService
        .editUser( this.token, item )
        .subscribe(
            response => {
                console.log( response )
                //this.getUsers();
            },
            error => {
                var errorMessage    = <any>error;
                if( errorMessage != null ){
                    console.log( errorMessage );
                }
            }
        );
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