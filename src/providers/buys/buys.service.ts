import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { delay } from 'rxjs/operators';

import PouchDB from 'pouchdb';

import { PouchDbAdapter } from '../pouchdb/pouchdb.adapter';

import { AppSettings } from '../../app/common/api.path';
import { ProductModel } from '../../app/models/product.model';

@Injectable()

export class BuysService
{
    // handler for the adapter class
    private _pouchDbAdapter: PouchDbAdapter;
    // rxjs observables to broadcast sync status
    syncStatus: Observable<boolean>;
    couchdbUp: Observable<boolean>;

    public buyUrl: string;
    public buy: any;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings
    ){
        let databases    = this.appSettings.getDatabases();
        this.buyUrl      = databases.buys.database;

        this._pouchDbAdapter    = new PouchDbAdapter( this.buyUrl );
        this.syncStatus         = this._pouchDbAdapter.syncStatus.asObservable();
        this.couchdbUp          = this._pouchDbAdapter.couchDbUp.asObservable();
    }

    getBuys( params: any ): Observable <any> {
        // For all buy
        return this._pouchDbAdapter.getAllDocsObservable( {} );
    }

    post( _buy: ProductModel ): Observable <any> {

        return this._pouchDbAdapter.postObservable( _buy );
    }

    put( _buy: ProductModel ): Observable <any> {

        return this._pouchDbAdapter.putObservable( _buy );
    }

    delete( _doc ): Observable <any> {
        return // this._pouchDbAdapter.deleteObservable( _doc );
    }

    searchBuyByString( text ){

        return this._pouchDbAdapter.getDocsByStringObservable( text )
        .pipe( delay( 2000 ));
    }
    // Pending, I have developing this method
    getBuysAsync( text ): Observable <any> {
        return this._pouchDbAdapter.getDocsByStringObservable( text )
        .pipe( delay( 2000 ));
    }

}