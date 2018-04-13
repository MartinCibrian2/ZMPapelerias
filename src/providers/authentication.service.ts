import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
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
        var currentUser    = JSON.parse( localStorage.getItem('currentUser'));
        this.token         = currentUser && currentUser.token;

        this.apiPaths    = appSettings.getPaths();
        this.loginUrl    = this.apiPaths.login;
    }

    login( credentials: LoginInterface ): Observable< Object > {
        let body      = JSON.stringify( credentials );
console.log( credentials,this.loginUrl )
        /* let _user$    = this
            .http
            .post(
                this.loginUrl,
                body
            )
            .map(( response: Response ) => {
                var _response    = response.json();
                let token        = _response && _response.token;
                if( token ){
                    this.apiPaths    = this.appSettings.mergePaths( _response.apiPath );
                    this.token       = token;
                    localStorage.setItem(
                        'currentUser', JSON.stringify( _response )
                    );
                } else {
                    // Return the object
                    console.log( _response );
                }

                return _response;
            })
            .catch(( error ) => {
                console.log( error );
                return error;
            }); */

        return //_user$;
    }

    logout(): void {
        this.token    = null;
        localStorage.removeItem('currentUser');
    }

}
