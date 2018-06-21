import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } 
    from 'ionic-angular';

import { ClientService } from '../../../providers/clients/client.service';
import { AuthenticationService } from '../../../providers/authentication.service';
import { AppSettings } from '../../../app/common/api.path';

import { AddClientPage } from './add/add-client';
import { EditClientPage } from './edit/edit-client';

@IonicPage()
@Component({
    selector: 'page-clients',
    templateUrl: 'clients.html',
    providers: [
        ClientService,
        AuthenticationService
    ]
})
export class ClientsPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    public clients = [];
    public token: string;
    public optionsResult: any;
    public notice: string = '';
    public url: string;
    // For sort list
    public descending: boolean = false;
    public order: number;
    public column: string = 'name';
    // For pagination by infiniteScroll
    public page         = 1;
    public perPage      = 0;
    public totalData    = 0;
    public totalPage    = 0;

    public addClientPage    = AddClientPage;
    public paramsClient     = { page: ClientsPage };

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public alertCtrl: AlertController,
        public toastCtrl: ToastController,
        private clientService: ClientService,
        private _authService: AuthenticationService,
        private appSettings: AppSettings
    ){
        this.url    = appSettings.path_api;

        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Clientes";
        this.token        = this._authService.getToken();
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad ClientsPage');
    }

    ngOnInit(): void {
        this.getClients( );
    }

    searchClientByString( eve ){
        let _searching    = eve.target.value;

        if(( _searching && _searching.trim() != '' ) || typeof _searching !== "undefined" ){
            if( _searching.length > 2 ){
                this.notice    = '';
                let fields    = {
                    name:    _searching,
                    surname: _searching,
                    email:   _searching
                };

                this.clientService
                .search( fields, this.token )
                .subscribe(
                    ( response: any ) => {
                        if( response.data.length ){
                            this.clients    = [];
                            response.data.forEach(( row )=> {
                                this.clients.push( row );
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
                this.getClients();
            }
        } else {
            this.getClients();
        }
    }

    getClients( clean: boolean = true, params?: any ){
        this.clientService
        .getClients( this.token, params )
        .subscribe(
            response => {
                if( response.data.length ){
                    this.perPage      = response.perPage;
                    this.totalData    = response.totalData;
                    this.totalPage    = response.totalPage;

                    if( clean ){
                        this.clients    = [];
                        this.page       = 1;
                    } else {
                        // It continues the load.
                    }

                    response.data.map(( row ) => {
                        this.clients.push( row );
                    });
                } else {
                    // It is empty.
                }
            }, error => {
                console.log( <any> error )
            }
        );
    }

    deleteClient( item: any): void {
        this.optionsResult    = {
            "message": item.name + " se ha eliminado",
            "duration": 5000,
            "position": 'bottom'
        }

        let confirm = this.alertCtrl.create({
            title: "Seguro de eliminar " + item.name + " ?",
            message: "Si acepta eliminar " + item.name + " ya no podrá recuperarlo.",
            buttons: [
                {
                    text: 'Cancelar',
                    handler: () => {
                        this.optionsResult.message    = "Canceló Eliminar " + item.name;
                        this.presentToast( this.optionsResult );
                    }
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        // Action delete item.
                        item.alive    = !item.alive;
                        item.alive    = item.alive.toString();
                        this
                        .clientService
                        .edit( item, this.token )
                        .subscribe(
                            response => {
                                this.getClients();
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

    openNavDetailsClient( item ){
        this.navCtrl.push( EditClientPage, { item: item });
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

    sort(){
        this.descending    = !this.descending;
        this.order         = this.descending ? 1 : -1;
    }

    doInfinite( infiniteScroll? ){
        this.page    += 1;
        setTimeout(( ) => {
            this.getClients( false, {"skip": this.clients.length });

            if( infiniteScroll )
                infiniteScroll.complete();
        }, 1000 );
    }

}
