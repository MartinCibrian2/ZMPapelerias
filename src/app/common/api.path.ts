import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
 import { Platform } from 'ionic-angular';
import { _catch } from 'rxjs/operator/catch';

@Injectable()
export class AppSettings {
    private config: Object = null;
    private env:    Object = null;

    private path_config: string   = 'assets/';
    private api_server: string    = "";
    private dir: string           = "";
    public path_api: string       = this.api_server + "" + this.dir;
    public apiPath: any;
    public xmlBilling: any;
    public _urlConfigs: string;
    public _databases: any;

    constructor(
        private http: Http,
        public platform: Platform
    ){
        this._urlConfigs = this.path_config;
        if( this.platform.is('cordova') && this.platform.is('android') ){
            this._urlConfigs    = "/android_asset/www/" + this._urlConfigs;
        } else {
            // Does not an platform android.
        }
        if( this.platform.is('cordova') && this.platform.is('ios') ){
            this._urlConfigs    = "/ios_asset/www/" + this._urlConfigs;
        } else {
            // Does not an platform android.
        }

        this.xmlBilling = this.getXmlBilling();
    }
    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig( key: any ){
        return this.config[ key ];
    }
    /**
     * Use to get the data found in the first file (env file)
     */
    public getXmlBilling( xml: any = 'xml' ){
        let request: any    = null;

        xml = xml || 'xml';

        request = this.http.get('../../'+ this.path_config +'data/billing/'+ xml +'.json')
        .map( res => res.json() )
        .subscribe( ( response ) => {
            this.xmlBilling = response;
        });
    }
    /**
     * Use to get the data found in the first file (env file)
     */
    public getEnv( key: any ){
        return this.env[ key ];
    }
    /**
     * This method:
     *   a) Loads "env.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[env].json" to get all env's variables (e.g.: 'config.development.json')
     */
    load( ){
        let _url    = "../" + this._urlConfigs + '/config/config';

        let _config$    = new Promise(( resolve, reject ) => {
            this
            .http
            .get( _url + '.json' )
            .map( res => res.json() )
            .catch(( error: any ):any => {
                console.log('Configuration file "'+ _url + '.json' +'" could not be read');
                resolve( true );
                return Observable
                    .throw(
                        error
                        .json()
                        .error || 'Server error'
                    );
            }).subscribe(( envResponse ) => {
                let request: any    = null;
                if( location.hostname === "localhost" || location.hostname === "127.0.0.1" ){
                    envResponse['env']    = 'development';
                } else {
                    // "env" variable is default value 'production'.
                }
                this.env    = envResponse;
                request     = this.getDevConfig( _url, envResponse );
                if( request ){
                    request
                    .map( res  => res.json() )
                    .catch(( error: any ) => {
                        console.error('Error reading ' + envResponse['env'] + ' configuration file');
                        resolve( error );
                        return Observable.throw( error.json().error || 'Server error');
                    })
                    .subscribe(( responseData ) => {
                        this.config    = Object.assign( responseData, envResponse );
                        resolve( true );
                    });
                } else {
                    console.error('Env config file "config.json" is not valid');
                    resolve( true );
                }
            });
        });

        return _config$;
    }

    private getDevConfig( _url, envResponse ){
        let request: any    = null;

        switch( envResponse['env'] ){
            case 'production': {
                request = this.http.get( _url +'.'+ envResponse['env'] + '.json');
            } break;
            case 'development': {
                request = this.http.get( _url +'.'+ envResponse['env'] + '.json');
            } break;
            case 'default': {
                console.error('Environment file is not set or invalid');
                //resolve(true);
            } break;
        }
        return request;
    }

    getPaths(){
        let _paths: any = this.config['paths'];
        for( let _path in _paths ){
            if( _paths.hasOwnProperty( _path )){
                this.config['paths'][ _path ]    = this.config['host'] +"/"+ _paths[ _path ];
            }
        }

        return this.config['paths'];
    }

    getDatabases(){
        if( this._databases ){
            // The databases already has been processed.
        } else {
            this._databases     = this.config['databases'];

            for( var _database in this._databases ){
                if( this._databases.hasOwnProperty( _database )){
                    var _pathApi    = this.config['host'] + this._databases[ _database ].database;
                    this._databases[ _database ].database    = _pathApi;
                    if( this._databases[ _database ].hasOwnProperty('views')){
                        Object.keys( this._databases[ _database ].views )
                        .forEach( ( _view ) => {
                            var _pathView    = this._databases[ _database ].views[ _view ];
                            this._databases[ _database ].views[ _view ]    = _pathApi + _pathView;
                        });
                    }
                }
            }
        }

        return this._databases;
    }

    mergePaths( new_paths ){
        let _paths: any = this.config['paths'];
        for( let _path in new_paths ){
            if( new_paths.hasOwnProperty( _path )){
                _paths[ _path ]    = this.config['host'];
                _paths[ _path ]   += "/";
                _paths[ _path ]   += new_paths[ _path ];
            }
        }

        return _paths;
    }

}
