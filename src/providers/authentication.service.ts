import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { LoginInterface } from '../app/interfaces/login';
import { AppSettings } from '../app/common/api.path';
import { PouchDbAdapter } from './pouchdb/pouchdb.adapter';

@Injectable()
export class AuthenticationService {
    // handler for the adapter class
    private _pouchDbAdapter: PouchDbAdapter;
    // rxjs observables to broadcast sync status
    syncStatus: Observable<boolean>;
    couchdbUp: Observable<boolean>;
    public token: string;
    private loginUrl: string;
    private apiPaths;

    constructor(
        public http: Http,
        public appSettings: AppSettings
    ){
        var currentUser    = JSON.parse( localStorage.getItem('currentUser'));
        //this.token         = currentUser && currentUser.token;
        let databases      = this.appSettings.getDatabases();
        this.loginUrl      = databases.login.database;

        this._pouchDbAdapter    = new PouchDbAdapter( this.loginUrl );
        this.syncStatus         = this._pouchDbAdapter.syncStatus.asObservable();
        this.couchdbUp          = this._pouchDbAdapter.couchDbUp.asObservable();
    }

    login( credentials: LoginInterface ): Observable< Object > {
        let body: any    = {};

        let _user$    = this.getUserByUsername( credentials )
        .map(( response: Response ) => {
            response["rows"].map(( row ) => {
                body       = row.key;
                body.id    = row.id;
                localStorage.setItem(
                    'currentUser', JSON.stringify( body )
                );
            });

            return body;
        })
        .catch(( error ) => {
            console.log( error );
            return error;
        });

        return _user$;
    }

    logout(): void {
        this.token    = null;
        localStorage.removeItem('currentUser');
    }

    getUserByUsername( params: any ): Observable<any> {
        let _params = Object.assign( { include_docs: false }, params );

        return Observable.from(
            this._pouchDbAdapter._pouchDB
            .query(( doc, emit ) => {
                if( doc.username ){
                    if( doc.active === true 
                    && doc.username == _params.username 
                    && _params.password == doc.password ){
                        emit({'username': doc.username, 'password': doc.password, 'email': doc.email, 'active': doc.active });
                    }
                }
                }, {
                    include_docs: false
                }
            )
        );
    }

}
