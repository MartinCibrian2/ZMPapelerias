import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { AppSettings } from '../app/common/api.path';

@Injectable()
export class UploadService
{
    public apiUrl: String;

    constructor(
        private _http: Http,
        public appSettings: AppSettings
    ){
        this.apiUrl    = appSettings.path_api;
    }

    makeFileRequest( url: string, params: Array< string >, files: Array< File >, token: string, name: string ){
        url    = this.apiUrl + url;
        return new Promise( function( resolve, reject ){
            var formData: any = new FormData();
            var xhr = new XMLHttpRequest();

            for( var i = 0; i < files.length; i ++ ){
                formData.append( name, files[ i ], files[ i ].name );
            }

            xhr.onreadystatechange = function(){
                if( xhr.readyState == 4 ){
                    if( xhr.status == 200 ){
                        resolve( JSON.parse( xhr.response ));
                    } else {
                        reject( xhr.response );
                    }
                }
            }

            xhr.open('POST', url, true );
            xhr.setRequestHeader('Authorization', token );
            xhr.send( formData );
        });
    }

    removeFileAtt( url: string, token: string ){
        let headers = this.getHeaders();
        url    = this.apiUrl + url;

        headers.headers.append('Authorization', token );

        let options    = new RequestOptions( headers );

        return this._http.delete( url, options )
        .map( res => res.json() );
    }

    getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});

        return { headers: headers };
    }
}