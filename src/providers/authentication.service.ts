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
        // let databases      = this.appSettings.getDatabases();
        // this.loginUrl      = databases.login.database;
        this.apiPaths    = appSettings.getPaths();
        this.loginUrl    = this.apiPaths.login;
console.log( this.loginUrl, this.appSettings );
    }

    login( credentials: LoginInterface ): Observable< Object > {
        credentials['gettoken']    = true;
        let _user$    = this
            .http
            .post(
                this.loginUrl,
                credentials
        )
        .map(( response: Response ) => {
            if( response.hasOwnProperty('_body') ){
                var _response    = JSON.parse( response['_body'] );
                let token        = _response && _response.token;
                if( token ){
                    this.apiPaths    = this.appSettings.mergePaths( _response.apiPaths );
                    this.token       = token;
                    localStorage.setItem(
                        'currentUser', JSON.stringify( _response )
                    );
                } else {
                    // Return the object
                    console.log( _response );
                }

                return _response;
            }

            return credentials;
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

    login1( credentials: LoginInterface ): Observable< Object > {
        let body: any    = {};

        let _user$    = this.getUserByUsername( credentials )
        .map(( response: Response ) => {
            response["rows"].map(( row ) => {
                body         = row.key;
                body.id      = row.id;
                body._rev    = body._rev;
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

    getUserByUsername( params: any ): Observable<any> {
        let _params = Object.assign( { include_docs: false }, params );

        return Observable.from(
            this._pouchDbAdapter._pouchDB
            .query(( doc, emit ) => {
                if( doc.username ){
                    if( doc.active === true 
                    && doc.username == _params.username 
                    && _params.password == doc.password ){
                        emit( doc );
                        // {'username': doc.username, 'password': doc.password, 'email': doc.email, 'role': doc.role, 'active': doc.active, "_rev": doc["_rev"] }
                    }
                }
                }, {
                    include_docs: false
                }
            )
        );
    }

}
