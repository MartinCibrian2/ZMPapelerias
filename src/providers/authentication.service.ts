import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { LoginInterface } from '../app/interfaces/login';
import { AppSettings } from '../app/common/api.path';

@Injectable()
export class AuthenticationService {
    public token: string;
    private loginUrl: string;
    private apiPaths;

    constructor(
        public http: Http,
        public appSettings: AppSettings
    ){
        this.apiPaths    = appSettings.getPaths();
        this.loginUrl    = this.apiPaths.login;
    }

    login( credentials: LoginInterface, gettoken = null ): Observable< Object > {
        if( gettoken != null ) {
            credentials["gettoken"] = gettoken;
        } else {
            // It has a gettoken.
        }

        let params = JSON.stringify( credentials );
        // let params = credentials;

        return this
        .http
        .post( this.loginUrl, params, this.getHeaders() )
        .map(( res: Response ) => res.json() );
    }

    logout(): void {
        this.token    = null;
        localStorage.removeItem('currentUser');
    }

    getIdentity(){
        let identity = JSON.parse( localStorage.getItem('currentUser'));
        //let identity = localStorage.getItem('currentUser');

        if( typeof identity === 'undefined'){
            identity = null;
        } else {
            identity = identity;
        }

        return identity;
    }

    getToken(){
        let token    = localStorage.getItem('token');

        if( typeof token === 'undefined'){
            this.token = null;
        } else {
            this.token = token;
        }

        return this.token;
    }

    getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});

        return { headers: headers };
    }


/*
    login2( credentials: LoginInterface, gettoken = null ): Observable< Object > {
        // credentials['gettoken']    = true;
        if( gettoken != null ) {
            credentials['gettoken']    = gettoken;
        } else {
            // It has a gettoken.
        }

        let _user$    = this
            .http
            .post(
                this.loginUrl,
                JSON.stringify( credentials ),
                this.getHeaders()
            )
         .map(( response: Response ) => {
            if( response.hasOwnProperty('_body') ){
                var _response    = JSON.parse( response['_body'] );
                let token        = _response && _response.token;
                if( token ){
                    //this.apiPaths    = this.appSettings.mergePaths( _response.apiPaths );
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
        });

        return _user$;
    }*/

}





/*
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
 */
