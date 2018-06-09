import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// the pouchdb-adapter file/class in the same folder
import { PouchDbAdapter } from './pouchdb.adapter';

// import { AppSettings } from '../../app/common/api.path';

const REMOTE_COUCH_DB_ADDRESS = 'http://localhost:5984/inventario' + '/_design/productos_x_nombre/_view/productsxname';

@Injectable()
export class PouchdbService 
{
    // handler for the adapter class
    private _pouchDbAdapter: PouchDbAdapter;
    // Contains the variables fo configuration.
    // private apiPaths: AppSettings;
    // rxjs observables to broadcast sync status
    syncStatus: Observable<boolean>;
    couchdbUp: Observable<boolean>;
    // URL of CouchDB (hardwired above)
    remoteCouchDBAddress: string = REMOTE_COUCH_DB_ADDRESS;
    // initiate adapter class and hook up the observables
    constructor() {
        this._pouchDbAdapter    = new PouchDbAdapter( REMOTE_COUCH_DB_ADDRESS );
        this.syncStatus         = this._pouchDbAdapter.syncStatus.asObservable();
        this.couchdbUp          = this._pouchDbAdapter.couchDbUp.asObservable();
    }
    // wrapper for the get 20docs method in the adpater class
    get20Docs(): Promise<any> {
        return Promise.resolve(this._pouchDbAdapter.getAllDocs( {} ));
    }

    post(doc): Promise<any> {
        return Promise.resolve(this._pouchDbAdapter.post(doc));
    }

}