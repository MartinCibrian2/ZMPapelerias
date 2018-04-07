import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { delay } from 'rxjs/operators';

import PouchDB from 'pouchdb';
/* import moment from 'moment'; */

import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';
import { ClientModel } from '../../app/models/client.model';
import { log } from 'util';

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

    getClients( params: any ): Promise <any> {
        // For all clients
        //return Promise.resolve( this._pouchDbAdapter.getAllDocs( params ) );
        // For active clients, the condition is active field iqual to true.
        return new Promise( resolve => {
            this._pouchDbAdapter._pouchDB
            .query( function( doc, emit ){
                    if( doc.active ){
                        if( doc.active === true ){
                            emit( doc.active );
                        }
                    }
                }, {
                    include_docs: true
                }
            )
            .then( function( result ){
                resolve( result );
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

    post( _client ): Promise <any> {
        _client    = new ClientModel( '', _client.nombre, _client.rfc, _client.tel, true );

        return Promise.resolve( this._pouchDbAdapter.post( _client ));
    }

    put( _client ): Promise <any> {
        let _rev    = _client._rev;
        _client     = new ClientModel( _client._id, _client.nombre, _client.rfc, _client.tel, _client.active );
        _client._rev    = _rev;

        return Promise.resolve( this._pouchDbAdapter.put( _client ));
    }

    delete( _doc ): Promise <any> {
        return Promise.resolve( this._pouchDbAdapter.delete( _doc ));
    }

    getCatalogClaveProdServs(): Observable<any> {
        var _urlJson = '../../'+ this.appSettings._urlConfigs +'data/catalogs/clave-prod-serv.json';

        return this.httpClient.get( _urlJson );
    }

    searchClientByString( texto ){
        return Promise.resolve( this._pouchDbAdapter.getDocsByString( texto ) );
    }
// Pending, I have developing this method
    getClientsAsync(page: number = 1, size: number = 15): Observable<any[]> {
        return new Observable<any[]>(observer => {
            /* observer.next( this.getPorts( page, size )); */
            observer.complete()
        }).pipe( delay( 2000 ));
    }

}