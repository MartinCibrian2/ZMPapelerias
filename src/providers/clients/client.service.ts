import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

/* import moment from 'moment'; */

import { AppSettings } from '../../app/common/api.path';
import { ClientModel } from '../../app/models/client.model';
import { AuthenticationService } from '../authentication.service';


@Injectable()

export class ClientService
{
    public token: string;
    public apiUrl: string;
    public clients: any;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings,
        private _authService: AuthenticationService
    ){
        var currentUser    = this._authService.getToken();
        this.token         = currentUser && currentUser["token"];
        this.apiUrl    = appSettings.path_api;
    }

    getClients( token: string, params?: any ): Observable <any> {
        if( params == null ){
            params   = '';
        } else {
            // The params has to be sending by object and not like string.
        }
        let _headers    = new HttpHeaders()
            .set('Accept', 'application/json');

        _headers.set('Authorization', token );
        // For clients
        let _client$    = this
            .httpClient
            .post(
                this.apiUrl + 'get-clients/0',
                params,
                { headers: _headers }
            );

        return _client$;
    }

    add( token, _client ): Observable <any> {
        _client    = new ClientModel( '', _client.name, _client.rfc, _client.phone, true );

        let headers    = this.getHeaders({'Authorization': token });

        let _client$    = this
            .http
            .post( this.apiUrl + 'register-client', _client, headers )
            .map( res => res.json());

        return _client$;
    }

    edit( _client, token ): Observable <any> {
        let headers    = this.getHeaders({'Authorization': token });

        let _client$    = this
            .http
            .post( this.apiUrl + 'update-client/' + _client.id, _client, headers )
            .map( res => res.json() );

        return _client$;
    }

    search( params: any, token: string ): Observable <any> {
        let headers = this.getHeaders();
            headers.headers.append('Authorization', token );

        params    = ( params == null ) ? {} : params;
        // For clients
        let _clients$    = this
            .http
            .post(
                this.apiUrl + 'searching-client',
                params,
                headers
            ).map(( res: Response ) => { return res.json() });

        return _clients$;
    }

    getCatalogClaveProdServs(): Observable<any> {
        var _urlJson = '../../'+ this.appSettings._urlConfigs +'data/catalogs/clave-prod-serv.json';

        return this.httpClient.get( _urlJson );
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