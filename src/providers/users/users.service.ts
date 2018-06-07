import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { delay } from 'rxjs/operators';

import PouchDB from 'pouchdb';

import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';
// import { ProductModel } from '../../app/models/product.model';

@Injectable()

export class UserService
{
    public token: string;
    public apiUrl: string;
    private apiPaths;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings
    ){
        var currentUser    = JSON.parse( localStorage.getItem('currentUser'));
        this.token         = currentUser && currentUser.token;
        this.apiUrl        = appSettings.path_api;
    }

    getUsers( params: any ): Observable <any> {
        if( params == null ){
            params   = '';
        } else {
            params    = 'params=' + JSON.stringify( params );
        }
        // For users
        let _users$    = this
            .http
            .post(
                this.apiUrl + 'get-users/0',
                params,
                this.getHeaders()
            ).map(( res: Response ) => { return res.json() });

        return _users$;
    }

    addUser( token, user ){
        let params = JSON.stringify( user );
        let headers = this.getHeaders();

        headers.headers.append('Authorization', token );
console.log( this.apiUrl + 'register-user', params )
        return this.http
        .post( this.apiUrl + 'register-user', params, headers )
        .map( res => res.json() );
    }

    getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});

        return { headers: headers };
    }

}