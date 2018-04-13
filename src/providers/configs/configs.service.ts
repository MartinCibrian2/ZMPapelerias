import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { delay, catchError } from 'rxjs/operators';

// import PouchDB from 'pouchdb';

// import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
//import { ProductModel } from '../../app/models/product.model';

@Injectable()

export class ConfigsService
{
    // handler for the adapter class
    // private _pouchDbAdapter: PouchDbAdapter;
    // rxjs observables to broadcast sync status
    syncStatus: Observable<boolean>;
    couchdbUp: Observable<boolean>;

    public configUrl: string;
    public config: any;
    public folder_file: string;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings
    ){
        //let databases    = this.appSettings.getDatabases();
        //this.configUrl      = databases.configs.database;

        //this._pouchDbAdapter    = new PouchDbAdapter( this.configUrl );
        //this.syncStatus         = this._pouchDbAdapter.syncStatus.asObservable();
        //this.couchdbUp          = this._pouchDbAdapter.couchDbUp.asObservable();
        this.folder_file    = "data/catalogs";
    }

    getConfigs( params: any ): Observable <any> {
        var _urlJson = '../../'+ this.appSettings._urlConfigs + this.folder_file + '/catalogs.json';
        // For all config
        return this.httpClient.get( _urlJson );
        //this._pouchDbAdapter.getAllDocsObservable( {} );
    }

    post( _config: any ): Observable <any> {
        var _urlJson = '../../'+ this.appSettings._urlConfigs + this.folder_file + '/catalogs.txt';
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/text'
            })
          };

        return this.httpClient.put( _urlJson, _config, httpOptions )
        /* .pipe(
          catchError( this.handleError( _config ))
        ) */;
        //this._pouchDbAdapter.postObservable( _config );
    }

    put( _config: any ): Observable <any> {

        return //this._pouchDbAdapter.putObservable( _config );
    }

    delete( _doc ): Observable <any> {
        return // this._pouchDbAdapter.deleteObservable( _doc );
    }

    searchConfigByString( text ){

        return //this._pouchDbAdapter.getDocsByStringObservable( text )
        //.pipe( delay( 2000 ));
    }
    // Pending, I have developing this method
    getBuysAsync( text ): Observable <any> {
        return //this._pouchDbAdapter.getDocsByStringObservable( text )
        //.pipe( delay( 2000 ));
    }

    private handleError( error: HttpErrorResponse ) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an ErrorObservable with a user-facing error message
        return new ErrorObservable(
          'Something bad happened; please try again later.');
      };

}