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
        this.buyUrl    = databases.buys.database;

        this._pouchDbAdapter    = new PouchDbAdapter( this.buyUrl );
        this.syncStatus         = this._pouchDbAdapter.syncStatus.asObservable();
        this.couchdbUp          = this._pouchDbAdapter.couchDbUp.asObservable();
    }

    getBuys( params: any ): Observable <any> {
        // For all buy
        return this._pouchDbAdapter.getDocsByStringObservable( {} );
    }

    post( _buy ): Observable <any> {
        //_buy    = new SellModel( '', _buy.nombre, _buy.rfc, _buy.tel, true );

        return //Observable.resolve( this._pouchDbAdapter.post( _buy ));
    }

    put( _buy ): Observable <any> {
        /* let _rev    = _buy._rev;
        _buy     = new sellModel( _buy._id, _buy.nombre, _buy.rfc, _buy.tel, _buy.active );
        _buy._rev    = _rev; */

        return //Observable.resolve( this._pouchDbAdapter.put( _buy ));
    }

    delete( _doc ): Observable <any> {
        return //Observable.resolve( this._pouchDbAdapter.delete( _doc ));
    }

    searchBuyByString( texto ){
        return this._pouchDbAdapter.getAllDocsObservable( texto )
        .pipe( delay( 2000 ));
    }
    // Pending, I have developing this method
    getBuysAsync( text ): Observable <any> {
        return this._pouchDbAdapter.getDocsByStringObservable( text )
        .pipe( delay( 2000 ));
    }

}