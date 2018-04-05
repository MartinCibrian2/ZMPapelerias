import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import PouchDB from 'pouchdb';
/* import moment from 'moment'; */

import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';

@Injectable()

export class ClientService
{  // handler for the adapter class
    private _pouchDbAdapter: PouchDbAdapter;
    // rxjs observables to broadcast sync status
    syncStatus: Observable<boolean>;
    couchdbUp: Observable<boolean>;

    public clientsUrl: string;
    public clients: any;
    // private pouchdbClients: any;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings
    ){
        let databases      = this.appSettings.getDatabases();
        this.clientsUrl    = databases.clients.database;

        this._pouchDbAdapter    = new PouchDbAdapter( this.clientsUrl );
        this.syncStatus         = this._pouchDbAdapter.syncStatus.asObservable();
        this.couchdbUp          = this._pouchDbAdapter.couchDbUp.asObservable();
    }

    getClients(): Promise <any> {
        return Promise.resolve( this._pouchDbAdapter.getDocs() );
    }

    post( _client ): Promise <any> {
        return Promise.resolve( this._pouchDbAdapter.post( _client ));
    }

    getCatalogClaveProdServs(): Observable<any> {
        var _urlJson = '../../'+ this.appSettings._urlConfigs +'data/catalogs/clave-prod-serv.json';

        return this.httpClient.get( _urlJson );
    }

    /*getClients1() {
        if ( this.clients ) {
            return Promise.resolve( this.clients );
        }

        return new Promise( resolve => {
            this.pouchdbClients
            .query( function( doc, emit ){
                emit( doc );
            }, { include_docs: true, is_checkin: false })
            .then( function( result ){
                ( result ) => {
                    this.clients  = [];
                    let docs = result.rows
                    .map(( row ) => {
                        this.clients.push( row.doc );
                    });
                    resolve( this.clients );
                    this.pouchdbClients
                    .changes({live: true, since: 'now', include_docs: true})
                    .on('change', ( change ) => {
                        this.handleChange( change );
                    });
                }
            }); 
        }).catch(( error ) => {
            console.log( error );
        });
    }*/

}