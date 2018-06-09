import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { AppSettings } from '../../app/common/api.path';
import { AuthenticationService } from '../authentication.service';

@Injectable()

export class AclService
{
    public token: string;
    public apiUrl: string;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings,
        private _authService: AuthenticationService
    ){
        var currentUser    = this._authService.getToken();
        this.token         = currentUser && currentUser["token"];
        this.apiUrl        = appSettings.path_api;
    }

    getRoles( params: any ): Observable <any> {
        if( params == null ){
            params   = '';
        } else {
            params    = 'params=' + JSON.stringify( params );
        }

        // let _roles$    = this
        return this.http
            .post(
                this.apiUrl + 'get-roles/0',
                params,
                this.getHeaders()
            ).map(( res: Response ) => { return res.json() });

        // return _roles$;
    }

    getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});

        return { headers: headers };
    }

}