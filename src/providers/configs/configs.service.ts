import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { delay } from 'rxjs/operators';

// import PouchDB from 'pouchdb';

// import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';
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
console.log( _urlJson )
        // For all config
        return this.httpClient.get( _urlJson );
        //this._pouchDbAdapter.getAllDocsObservable( {} );
    }

    post( _config: any ): Observable <any> {

        return //this._pouchDbAdapter.postObservable( _config );
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

}