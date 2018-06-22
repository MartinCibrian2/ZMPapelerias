import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AppSettings } from '../../app/common/api.path';

@Injectable()

export class ConfigsService
{
    public apiUrl: String;
    public folder_file: string;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings
    ){
        this.folder_file    = "data/catalogs";
        this.apiUrl         = appSettings.path_api;
    }

    get( token: string, params?: any ): Observable <any> {
        if( params == null ){
            params   = '';
        } else {
            // The params has to be sending by object and not like string.
        }
        let _headers    = new HttpHeaders()
            .set('Accept', 'application/json');

        _headers.set('Authorization', token );
        // For configs
        let _config$    = this
            .httpClient
            .post(
                this.apiUrl + 'get-configs/0',
                params,
                { headers: _headers }
            );

        return _config$;
    }

    add( _catalog, token ): Observable <any> {
        // _catalog    = new ClientModel( '', _catalog.name, _catalog.rfc, _catalog.phone, true );

        let headers    = this.getHeaders({'Authorization': token });

        let _catalog$    = this
            .http
            .post( this.apiUrl + 'register-config', _catalog, headers )
            .map( res => res.json());

        return _catalog$;
    }

    getHeaders( params?: any ){
        const headers    = new Headers( );
        headers.append('Accept', 'application/json');
        if( params !== null ){
            for( var index in params ){
                headers.append( index, params[ index ]);
            }
        }

        return { headers: headers };
    }

}