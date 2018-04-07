declare function require( name: string );

import PouchDB from 'pouchdb';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

PouchDB.plugin( require('pouchdb-upsert'));
PouchDB.plugin( require('pouchdb-find'));

export class PouchDbAdapter {

    public _pouchDB: any;
    public _couchDB: any;
    private _remoteCouchDBAddress: string;
    private _pouchDbName: string;
    // rxjs behaviour subjects to expose stats flags
    syncStatus    = new BehaviorSubject<boolean>(false);
    couchDbUp     = new BehaviorSubject<boolean>(false);

    constructor( remoteCouchDBAddress: string ){
        this._remoteCouchDBAddress = remoteCouchDBAddress;
        // string function to extract the database name from the URL
        this._pouchDbName = remoteCouchDBAddress
            .substr(remoteCouchDBAddress.lastIndexOf('/') + 1 );

        // init local PouchDB
        // new PouchDB(this._pouchDbName).destroy().then(function () {
        //     // database destroyed
        //     console.log('Local DB is Distroyed!!!!!!');
        // }).catch(function (err) {
        //     // error occurred
        // });
        this._pouchDB = new PouchDB( this._pouchDbName );
        // init PouchDB adapter for remote CouchDB
        this._couchDB = new PouchDB( remoteCouchDBAddress );
        // sync the PouchDB and CouchDB
        this._pouchDB.sync( this._couchDB, {
            live: true,
            retry: true,
        })
        .on('paused', err => { this.syncStatusUpdate(); })
        .on('change', info => { this.syncStatusUpdate(); });
    }
    // pretty basic and crude function
    // return a Promise with the first 20 docs from allDocs as is
    getDocs(): Promise<any> {
        return new Promise( resolve => {
            this._pouchDB.allDocs({
                include_docs: true,
                //limit: 20
            })
            .then(( result ) => {
                resolve(result);
            })
            .catch(( error ) => {
                console.log( error );
            });
        });
    }
    
    findById( _id ){
        return new Observable( observer => {
            this._pouchDB
            .get( _id )
            .then(( doc ) => {
                observer.next( doc.data );
            });
        });
    }

    post( doc: any ): Promise<any> {
        return new Promise( resolve => {
            this._pouchDB.post( doc )
                .then(( response => {
                    resolve( response );
                }))
                .catch(( error ) => {
                    console.log( error );
                });
        });
    }

    put( doc ): Promise<any> {
        return new Promise( resolve => {
            this._pouchDB.put( doc )
                .then(( response => {
                    resolve( response );
                }))
                .catch(( error ) => {
                    console.log( error );
                });
        });
    }

    delete( doc ): Promise <any> {
        return new Promise( resolve => {
            this._pouchDB
            .remove( doc._id, doc._rev )
            .then(( response  ) => {
                console.log("Se elimnino el item: "+ doc._id +' '+ doc._rev );
                resolve( response );
            })
            .catch(( error ) => {
                console.log( error );
            });
        });
    }
    // function to call the below functions
    // then update the rxjs BehaviourSubjects with the 
    // results
    private syncStatusUpdate(): void {
        this.checkPouchCouchSync()
            .then(( result ) => {
                this.syncStatus.next( result );
            });
        this.checkCouchUp()
            .then(( result ) => {
                this.couchDbUp.next( result );
            });

    }
    // part of the JSON returned by PouchDB from the info() method
    // is 'update_seq'. When these numbers are equal then the databases
    // are in sync. The way its buried in the JSON means some string
    // functions are required to extract it
    private checkPouchCouchSync(): Promise<boolean> {
        // if both objects exist then make a Promise from both their
        // info() methods
        if( this._pouchDB && this._couchDB ){
            return Promise.all([this._pouchDB.info(), this._couchDB.info()])
                // using the 0 and 1 items in the array of two
                // that is produced by the Promise
                // Do some string trickery to get a number for update_seq
                // and return 'true' if the numbers are equal.
                .then((results: any[]) => {
                    return (Number(String(results[0]
                        .update_seq)
                        .split('-')[0])
                        ===
                        Number(
                            String( results[ 1 ].update_seq )
                            .split('-')[ 0 ]
                        )
                    );
                }) // on error just resolve as false
                .catch((error) => { return false; });
        } else {
            // if one of the PouchDB or CouchDB objects doesn't exist yet
            // return resolve false
            return Promise.resolve(false);
        }
    }
    // fairly self explanatory function to make a 
    // GET http request to the URL and return false
    // if an error status or a timeout occurs, true if 
    // successful.
    private checkCouchUp(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this._remoteCouchDBAddress, true);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            };
            xhr.onerror = () => {
                resolve(false);
            };
            xhr.send();
        });
    }
}