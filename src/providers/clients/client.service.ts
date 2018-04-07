import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import PouchDB from 'pouchdb';
/* import moment from 'moment'; */

import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';
import { ClientModel } from '../../app/models/client.model';

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
        //return Promise.resolve( this._pouchDbAdapter.getDocs() );
        return Promise.resolve( this._pouchDbAdapter.getDocs() );
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

    SearchClient( texto: string ){
        console.log(texto);
        var regex, _list;

        return new Promise( resolve => {
            this._pouchDbAdapter._pouchDB
            .query( function( doc, emit ){
                    var regex = new RegExp( texto, "i");
                    //if(( doc.nombre.toLowerCase().indexOf( texto.toLowerCase() ) > -1 ) && doc.active === true ){
                    if(( doc.nombre.match( regex ) ) && doc.active === true ){
                        console.log( doc.nombre, doc.active )
                        // emit( doc._id, { nombre: doc.nombre } );
                        emit( doc.nombre );
                    }
                }, {
                    startkey: texto,
                    endkey: texto + '\ufff0',
                    include_docs: true
                }
            )
            .then( function( result ){
                _list  = [];
                result.rows
                .map(( row ) => {
                    _list.push( row.doc );
                });
                resolve( _list );
            });
        })
        .catch((error) => {
            console.log(error);
        });
    }

}