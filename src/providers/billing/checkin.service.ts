declare function require( name: string );

import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Platform } from 'ionic-angular';

// import { File } from '@ionic-native/file';
import { saveAs } from 'file-saver';

import PouchDB from 'pouchdb';
import xml2js from 'xml2js';
import xmlbuilder from 'xmlbuilder';

import moment from 'moment';
import sha256 from 'sha256';

import { AppSettings } from '../../app/common/api.path';
import { isObject } from 'util';

//const StampService = require('sw-sdk-nodejs').StampService;
//const Authentication = require('sw-sdk-nodejs').Authentication;

@Injectable()

export class CheckinService {
    public claveProdServs: any;
    private apiPaths: AppSettings;
    private billingUrl: string;
    private apiUrl: string;
    builder;

    public tickets: any;
    private pouchdbTickets: any;
    private pouchdbBilling: any;
    public jsonBaseCompany: any;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings,
        public platform: Platform
    ){
        this.apiPaths      = appSettings.getPaths();
        this.billingUrl    = this.apiPaths["billing"];

        this.apiUrl     = appSettings.getConfig('api');
        this.builder    = xmlbuilder;

        if( !this.pouchdbTickets ){
            this.pouchdbTickets = new PouchDB('ticket');
        }

        if( !this.pouchdbBilling ){
            this.pouchdbBilling = new PouchDB('billing');
        }

        this.jsonBaseCompany = this.getJsonBaseCompany();
    }

    checking( bill: any ){
        var xml = this.getXml( bill );

        this.sendFile( xml );

        return xml;
    }

    getXml( obj: any ){
        //var builder1 = new xml2js.Builder();
        
        var xml = this.appSettings.xmlBilling,
        // xml2 = builder1.buildObject( xml ),
        feed = this.builder.create(
            xml,
            { version: '1.0', encoding: 'UTF-8' },
            { 
              skipNullAttributes: false, 
              headless: false, ignoreDecorators: false,
              separateArrayItems: false, noDoubleEncoding: false,
              stringify: {}
            }
        );

        return feed.end({ pretty: true, allowEmpty: true });
    }

    getCatalogClaveProdServs(): Observable<any> {
        var _urlJson = '../../'+ this.appSettings._urlConfigs +'data/catalogs/clave-prod-serv.json';

        return this.httpClient.get( _urlJson );
    }

    getTickets() {
        if ( this.tickets ) {
            return Promise.resolve( this.tickets );
        }

        return new Promise( resolve => {
            /* this.pouchdbTickets
            .query( function( doc, emit ){
                emit( doc );
            }, { include_docs: true, is_checkin: false })
            .then( function( result ){
                ( result ) => {
                    this.tickets  = [];
                    let docs = result.rows
                    .map(( row ) => {
                        this.tickets.push( row.doc );
                    });
                    resolve( this.tickets );
                    this.pouchdbTickets
                    .changes({live: true, since: 'now', include_docs: true})
                    .on('change', ( change ) => {
                        this.handleChange( change );
                    });
                }
            }); */
            this.pouchdbTickets.allDocs({
                include_docs: true, 
                attachments: true,
                descending: true
            }).then(
                ( result ) => {
                    this.tickets  = [];
                    let docs = result.rows
                    .map(( row ) => {
                        this.tickets.push( row.doc );
                    });
                    resolve( this.tickets );
                    this.pouchdbTickets
                    .changes({live: true, since: 'now', include_docs: true})
                    .on('change', ( change ) => {
                        this.handleChange( change );
                    });
                }
            );
        }).catch(( error ) => {
            console.log( error );
        });
    }

    getOriginalString( xmlJson: any, originalString: string = '|' ){
        Object.keys( xmlJson )
        .forEach(( index, i ) => {
            if( typeof xmlJson[ index ] === "object"){
                //console.log( index, typeof xmlJson[ index ] );
                originalString    = this.getOriginalString( xmlJson[ index ], originalString );
            } else {
                originalString    += "|"+ xmlJson[ index ];
            }
        });

        return originalString;
    }

    prepareJsonForDocument( tickets: any ){
        var jsonxmlBase = this.appSettings.xmlBilling;
        let dataXmlJson = {},
        _dateAtMoment   = moment().format('YYYY-MM-DDThh:mm:ss'),
        Total          = 0,
        Subtotal       = 0,
        _ivaDefault    = 0.160000;

        jsonxmlBase["cfdi:Comprobante"]['@Fecha']    = _dateAtMoment;
        /* For the complemento */
        // jsonxmlBase["cfdi:Comprobante"]["cfdi:Complemento"]["tfd:TimbreFiscalDigital"]['@FechaTimbrado'] = _dateAtMoment;

        var _Concept     = jsonxmlBase["cfdi:Comprobante"]["cfdi:Conceptos"],
            _taxes       = _Concept["cfdi:Concepto"][ 0 ]["cfdi:Impuestos"];
            // _retentions  = jsonxmlBase["cfdi:Comprobante"]["cfdi:Impuestos"]["cfdi:Retenciones"];

        var transfers       = Object.create( _taxes["cfdi:Traslados"]["cfdi:Traslado"][ 0 ]),
            addTransfers    = Object.assign( {}, _taxes["cfdi:Traslados"]["cfdi:Traslado"][ 0 ]),
            // retentions   = Object.assign( {}, _retentions["cfdi:Retencion"][ 0 ] ),
            _Concepts    = {"cfdi:Concepto": [ ]},
            _Taxes       = {"cfdi:Traslado": [ ]},
            _addTaxes    = 0;
            // _Retentions  = {"cfdi:Retencion": [ ]};

        _Concept    = Object.create( _Concept["cfdi:Concepto"] );
        delete _Concept["cfdi:Impuestos"];
        // Agregado de los conceptos
        tickets
        .forEach(( concepts, key ) => {
            Subtotal = 0;
            Object.keys( concepts )
            .forEach(( index ) => {
                if( index.indexOf("_") > -1 && index.indexOf("_") == 0 ){
                    // This field it is not necessary.
                } else {
                    if( index == 'concepts' && concepts[ index ].length ){
                        concepts[ index ]
                        .forEach(( concept, i ) => {
                            let _concept      = Object.create( _Concept );
                            let _transfers    = Object.create( transfers );
                            let _amount       = concept.importeart * _ivaDefault;

                            _concept["@ValorUnitario"]    = concept.precioart;
                            _concept["@Cantidad"]         = concept.cantidadart;
                            _concept["@ClaveUnidad"]      = concept.ClaveUnidad;
                            _concept["@Unidad"]           = concept.unidadart;
                            _concept["@Descripcion"]      = concept.Descripcion;
                            _concept["@ClaveProdServ"]    = concept.claveProdServ;
                            _concept["@Importe"]          = concept.importeart;
                            _concept["@NoIdentificacion"] = concepts["NoIdentificacion"];

                            _transfers["@Base"]          = concept.importeart;
                            _transfers["@Impuesto"]      = "002";
                            _transfers["@TipoFactor"]    = "Tasa";
                            _transfers["@TasaOCuota"]    = String( _ivaDefault ) + "0000";
                            _transfers["@Importe"]       = new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
                                                         .format( _amount );

                            _addTaxes    = _addTaxes + _amount;
                            // retentions["@Importe"]    = retentions["@Importe"] + _amount;

                            if( _concept.hasOwnProperty("cfdi:Impuestos")){
                                // Exists the property.
                            } else {
                                var _newObj    = {"cfdi:Impuestos": {"cfdi:Traslados": {"cfdi:Traslado": [] }}};
                                _concept    = Object.assign( _concept, _newObj );
                            }

                            _concept["cfdi:Impuestos"]["cfdi:Traslados"]["cfdi:Traslado"]
                            .push( _transfers );
                            _Concepts["cfdi:Concepto"].push( _concept );

                            Subtotal    = Subtotal + concept.importeart;
                        });
                    } else {
                        dataXmlJson[ index ] =  concepts[ index ];
                    }
                }
                jsonxmlBase["cfdi:Comprobante"]["cfdi:Conceptos"]    = concepts.Conceptos;
            });
            jsonxmlBase["cfdi:Comprobante"]["@Folio"]    = concepts.Folio;
        });
        addTransfers["@Importe"]    = 
            new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
                .format( _addTaxes );
        delete addTransfers["@Base"];

        jsonxmlBase["cfdi:Comprobante"]["cfdi:Conceptos"]    = _Concepts;
        jsonxmlBase["cfdi:Comprobante"]["@SubTotal"]    = Subtotal;
        jsonxmlBase["cfdi:Comprobante"]["cfdi:Impuestos"]["cfdi:Traslados"]["cfdi:Traslado"][ 0 ]    = addTransfers;
        jsonxmlBase["cfdi:Comprobante"]["cfdi:Impuestos"]["@TotalImpuestosTrasladados"] = 
            new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
                .format( _addTaxes ); // ( _addTaxes ).toLocaleString('es-mx', {minimumFractionDigits: 2});
        jsonxmlBase["cfdi:Comprobante"]["@Total"] = 
            new Intl.NumberFormat('es-MX', { maximumFractionDigits: 2 })
                .format( Subtotal + ( Subtotal * _ivaDefault ));
        // Agregado de los datos del emisor.
        Object.keys( jsonxmlBase["cfdi:Comprobante"])
        .forEach(( obj, key ) => {
            if( this.jsonBaseCompany.hasOwnProperty( obj ) ){
                return jsonxmlBase["cfdi:Comprobante"][ obj ] = this.jsonBaseCompany[ obj ];
            } else {
                // It does not merge the field.
            }
        });

        /* // Complemento: Creo eso se regresa despues del timbrado ( SELLADO )
        ,
        "cfdi:Complemento": {
            "tfd:TimbreFiscalDigital": {
                "@xmlns:tfd": "http://www.sat.gob.mx/TimbreFiscalDigital",
                "@xsi:schemaLocation": "http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd",
                "@Version": "1.1",
                "@UUID": "10865254-4E6C-4B0C-913B-3CE2BB639160",
                "@FechaTimbrado": "",
                "@RfcProvCertificado": "SAT970701NN3",
                "@SelloCFDI": "KKuJWKeoAgGjmJNfotaEDtQdDGDSeIib3KkEvz86qPAhB8V/SyBGDlZKhUe+HcymrYt0RDlzNt2/7AU3WmICHmS1HfbBo4W9+CJdr/R0DTjJz+6Jduy9mLA3aTnz0KWzPnB14PPzIzIvLgiiWyc97Og5m6y3QUMaRlG/HYfcvZo/g6jySOuY5nPtUp8P/ADlBpRnDC/ClMZuBz5KDCC527dBwLfWqXDJMNB2M7fmAUTmhviEhp920JcY33OOZpo/qqACFSxseaZis7yd+aGBb9qifGS9vP1LpeXV2uHX40QybrOfdQp1s6ZqAxdupbGyjVm/kL1zr1pGHk2+r4DZvA==",
                "@NoCertificadoSAT": "00001000000403258748",
                "@SelloSAT": "Tntbmbod4u5fAXv/o47eqebUQEF99Fnl2O8zoqdzgixAGVlFq1VnyODuz65nyCVmp8sh+5um4gcg7LPKwVhO+/xhYJOTqzipwl794lFk3EhjkyFdWUA8rJNDIW+YyU9Rb+8s91bEG3R690gz+gurjHrFEL9WpU4fBjzYlIZmdvt4kZR+IEOKo3jM82ptOZ2wG9Xcrm6OJ1/ewODliC5X1KMT7Tn+vXpu50NCEhfdH8c93DkX46JQfpOmVW7ue74FRo1hJ0sUkvmjabbCxJsWk2FpnboANTh9kZfu0BB/pywnDbzubmojT21Zt/O2tLq8cFdWsc4HGpuCqnuM/Vsm5g=="
            }
        }
         */

        return jsonxmlBase;
    }

    sendFile( xmlString: string ){
        var _url = '../../'+ this.appSettings._urlConfigs +'data/';
        var objXmlProcessed = this.appSettings.xmlBilling;

        var xmlBlob = new Blob([ xmlString ], {"type": "text/xml;charset=utf-8", endings: 'native'}),
            pdfBlob = new Blob([ xmlString ], {"type": "text/pdf"});


        var params = {
            //user: "contacto@colegiocuauhtli.com.mx",
            //password: "T3mp0r4l$",
            user: "demo",
            password: "123456789",
            //url: 'http://services.test.sw.com.mx',
            url: 'https://cors.io/?services.test.sw.com.mx',
            //mode: 'no-cors'
            //token: "T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbXB3YVZxTHdOdHAwVXY2NTdJb1hkREtXTzE3dk9pMmdMdkFDR2xFWFVPUXpTUm9mTG1ySXdZbFNja3FRa0RlYURqbzdzdlI2UUx1WGJiKzViUWY2dnZGbFloUDJ6RjhFTGF4M1BySnJ4cHF0YjUvbmRyWWpjTkVLN3ppd3RxL0dJPQ.T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbFlVcU92YUJTZWlHU3pER1kySnlXRTF4alNUS0ZWcUlVS0NhelhqaXdnWTRncklVSWVvZlFZMWNyUjVxYUFxMWFxcStUL1IzdGpHRTJqdS9Zakw2UGRiMTFPRlV3a2kyOWI5WUZHWk85ODJtU0M2UlJEUkFTVXhYTDNKZVdhOXIySE1tUVlFdm1jN3kvRStBQlpLRi9NeWJrd0R3clhpYWJrVUMwV0Mwd3FhUXdpUFF5NW5PN3J5cklMb0FETHlxVFRtRW16UW5ZVjAwUjdCa2g0Yk1iTExCeXJkVDRhMGMxOUZ1YWlIUWRRVC8yalFTNUczZXdvWlF0cSt2UW0waFZKY2gyaW5jeElydXN3clNPUDNvU1J2dm9weHBTSlZYNU9aaGsvalpQMUxqU1Fka3p5QWREb3RteWlLOW52RVpqa2E0NzIxUXVtZmlHSGlrVk4wWHZaODlja0VlZGxUK1czVVZmbUE3K1BCTWcrUStxOUZyL1lodUpCVEl5NFFWekdEWkdoMTNnSnpES3RlZmpWaHpaQ24rTE5oMnA4RzNISmJXMjhScCtBKzJQeGNrcEhjNVhmME9WeG91QVVTSjg9.U_VF2jaOm-FMTCmlYeE0RlN9kAgi8DV0EcmPKYSHitw"
            //token: "dlI2UUx1WGJiKzViUWY2dnZGbFloUDJ6RjhFTGF4M1BySnJ4cHF0YjUvbmRyWWpjTkVLN3ppd3RxL0dJPQ.T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbFlVcU92YUJTZWlHU3pER1kySnlXRTF4alNUS0ZWcUlVS0NhelhqaXdnWTRncklVSWVvZlFZMWNyUjVxYUFxMWFxcStUL1IzdGpHRTJqdS9Zakw2UGRkZEFZcDFhY3lhUC95OUZOaU1xZGtnZEdlMUhwZUp3U2c3RllwZyt5TzNQMjVpWTNkOXlDTllpR2laNWdKNHBKNGhqL3VmVkwxWmtEQU9ibHpOSzI0YnA0d3l1TklyL2RUMU41alh5MEJqNnIyb2lCajI3a3RVRHFxdTZjTHFacXl5dnlBVzhjdnBraTVjelRNdEZteDlucUJ2QWFLSlJOWlo5N3dsRTUwcUt5QmlsUldjN1VRQTVRamJUR3ZNdEJ0VDBETVBrVThpTTE3dmtzNjhwRU1DbWlyQ2pGbyt0OWtMd0Z6V2l1bnlKbjB2cXdhc1RRbWsxcU5MUXNTWUFkdjI2S0x0MWUwbjM5U3RGNXQ3aDZrQlA5ajFhS2RCeDB3RDY2WHduSG1oRUVUNmNBcTZDdlF0ZnFDY2RBTlA3OTZjMEtqUXIrZEZMS3dzcUdjODRraVZuYXhUQWNCeWlGa1drdDBWUXBmSzNBRmlyRXRieXJQd1pZUnJxY1lESTNHelNlWnVTUHU1VlFJd2QwTWVhQmh3PT0.0ZcWDXbHF11LxtxY43O0WQuolqfdlvpc2ySOYkY-L8Q"
        };
        var xhr = new XMLHttpRequest();
            xhr.open("POST", this.apiUrl + "cfdi-upload", true ); // services.test.sw.com.mx/security/authenticate
            // xhr.withCredentials = true;
            //xhr.setRequestHeader('Accept', 'Application/json');
            //xhr.setRequestHeader('Content-Type', 'q=0.8;application/json;q=0.9');
            //xhr.setRequestHeader('X-Requested-By', 'Angular 5');
            
            // xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            // xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            let formData: FormData = new FormData();
            // console.log( xmlBlob );
            formData.append('xml', xmlBlob );
            formData.append('client', objXmlProcessed['cfdi:Comprobante']['cfdi:Receptor']['@Nombre'] );
            formData.append('rfc', objXmlProcessed['cfdi:Comprobante']['cfdi:Receptor']['@Rfc'] );
            formData.append('date', objXmlProcessed['cfdi:Comprobante']['@Fecha'] );
            //formData.append('user', "demo" );
            //formData.append('password', "12345678" );
            //formData.append('url', "http://services.test.sw.com.mx/security/authenticate" );

            xhr.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    console.log( JSON.parse( xhr.response ) );
                } else {
                    console.log( this.responseText )
                }
            });

            /* xhr.setRequestHeader("user", "demo");
            xhr.setRequestHeader("password", "123456789");
            xhr.setRequestHeader("Cache-Control", "no-cache");
            xhr.setRequestHeader("Postman-Token", "18410574-d027-4957-8808-101a5ae97fda"); */

            xhr.send( formData );
        /*let auth   = Authentication.auth( params );
		var callback = ( error, data ) => {
			if( error ){
				console.log(error);
            } else {
                console.log(data);
            }
        };
        let _token = auth.Token( callback );*/

    	//let stamp    = StampService.Set( params );
    	//stamp.StampV3( xmlString, callback );
            //File.createFile( _url, 'myFile.xml', xmlBlob );

            /* fs.writeFile( _url + '/myFile.xml', xmlString, (err) => {  
                // throws an error, you could also catch it here
                if (err) throw err;
                // success case, the file was saved
                console.log('Xml saved!');
            } ); */

            //if( !this.platform.is('android')){
            //    saveAs( xmlBlob, _url+file_xml ); 
            //} else {
                /* File.writeFile( _url, file_xml, xmlBlob, true).then(()=> {
                    alert("file created at: " + _url);
                }).catch(()=>{
                   alert("error creating file at :" + _url);
                }) */
           // }
           /* this.http.get( _url, {responseType: ResponseContentType.Blob})
            .map(( res ) => {
                return new Blob([ res.blob() ], {type: 'application/xml'});
            })
            .subscribe(( xmlBlob: Blob ) => {
                    saveAs( xmlBlob, 'testFile.pdf' );
                }
            ); */

        let _billing    = {
            "_id": "One",
            "_attachments": {
                "Factura.xml": {
                    "content_type": 'text/xml',
                    "data": xmlBlob
                }
            }
        };

        return; // this.saveXmlFile( _billing );
    }

    saveXmlFile( _billing: any ){
        let result: any;

        this.pouchdbBilling
        .put( _billing )
        .then( function( response ){
            console.log( response );
            if( response.ok ){
                result = response;
            } else {
                result = false;
            }
        })
        .catch( function( error ){
            console.log( error );
            result = false;
        });

        return result;
    }

    handleChange( change ){
        let changedDoc = null;
        let changedIndex = null;

        this.tickets.forEach(( doc, index ) => {
            if( doc._id === change.id ){
                changedDoc = doc;
                changedIndex = index;
            }
        });
        //A document was deleted
        if( change.deleted ){
            this.tickets.splice(changedIndex, 1);
        } else {
            //A document was updated
            if( changedDoc ){
                this.tickets[changedIndex] = change.doc;
            } else {
                //A document was added
                this.tickets.push(change.doc);
            }
        }
    }

    getCatalogClaveProdServs1(){
        var _urlJson = '../../assets/data/catalogs/clave-prod-serv.json';
        let _config$    = new Promise(( resolve, reject ) => {
            this.http
            .get( _urlJson )
            .map( res => res.json() )
            .catch(( error: any ):any => {
                console.log('Error reading ' + _urlJson );
                resolve( true );
                return Observable
                    .throw(
                        error
                        .json()
                        .error || 'Server error'
                    );
            }).subscribe(( response ) => {
                if( response.c_ClaveProdServ ){
                    this.claveProdServs    = response.c_ClaveProdServ;
                    resolve( true );
                } else {
                    reject( true);
                }
            });
        });

        return _config$;
    }

    private getJsonBaseCompany(){
        return this.httpClient
        .get('../../'+ this.appSettings._urlConfigs +'data/billing/company-data.json')
        .subscribe(
            response => {
                this.jsonBaseCompany = response;
            }
        );
    }
}
        /*
            // Impuestos
            "cfdi:Traslados": {
                "cfdi:Traslado": [{
                    "@Impuesto": "",
                    "@TipoFactor": "Tasa",
                    "@TasaOCuota": "0.160000",
                    "@Importe": ""
                }]
            }

            // Impuestos
            "@TotalImpuestosRetenidos": "",
            "cfdi:Retenciones": {
                "cfdi:Retencion": [{
                    "@Impuesto": "002",
                    "@Importe": 0.00
                }]
            },

            // Complemento
            "implocal:ImpuestosLocales": {
                "@xmlns:implocal": "http://www.sat.gob.mx/implocal",
                "@version": "1.0",
                "@TotalRetenciones": "0.00",
                "@xsi:schemqaLocation": "http://www.sat.gob.mx/implocal http://www.sat.gob.mx/sitio_internet/cfd/implocal/implocal.xsd",

                "implocal:RetencionesLocales": {
                    "@ImpLocRetenido": "Retencion ISN",
                    "@TasadeRetencion": "1.00",
                    "@Importe": "0.00"
                },
                "implocal:TrasladosLocales": {
                    "@ImpLocTrasladado": "ISH",
                    "@TasadeTraslado": "3.00",
                    "@Importe": "0.00"
                }
            }
        */