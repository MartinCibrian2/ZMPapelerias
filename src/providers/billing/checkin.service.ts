import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import PouchDB from 'pouchdb';
import xml2js from 'xml2js';
import xmlbuilder from 'xmlbuilder';

import moment from 'moment';

import { AppSettings } from '../../app/common/api.path';

@Injectable()

export class CheckinService {
    public claveProdServs: any;
    private apiPaths: AppSettings;
    private billingUrl: string;
    builder;

    public tickets: any;
    private pouchdbTickets: any;
    private pouchdbBilling: any;
    public jsonBaseCompany: any;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings
    ){
        this.apiPaths      = appSettings.getPaths();
        this.billingUrl    = this.apiPaths["billing"];

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
console.log( bill, xml );
        this.sendFile( xml );

        return xml;
    }

    getXml( obj: any ){
        //var builder1 = new xml2js.Builder();
        //var xml2 = builder1.buildObject( xml );
        var xml = this.appSettings.xmlBilling,

        feed = this.builder.create(
            xml,
            { version: '1.0', encoding: 'UTF-8', standalone: true }
        );

        return feed.end({ pretty: true });
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

    prepareJsonForDocument( tickets: any ){
        var jsonxmlBase = this.appSettings.xmlBilling;
        let dataXmlJson = {},
        _dateAtMoment   = moment().format('YYYY-MM-DDTh:mm:ss'),
        Total          = 0,
        Subtotal       = 0,
        _ivaDefault    = 0.160000;

        jsonxmlBase["cfdi:Comprobante"]['@Fecha']    = _dateAtMoment;
        jsonxmlBase["cfdi:Comprobante"]["cfdi:Complemento"]["tfd:TimbreFiscalDigital"]['@FechaTimbrado'] = _dateAtMoment;

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
                    if( index == 'Conceptos' && concepts[ index ].length ){
                        concepts[ index ]
                        .forEach(( concept, i ) => {
                            let _concept      = Object.create( _Concept );
                            let _transfers    = Object.create( transfers );
                            let _amount       = concept.precioart * _ivaDefault;

                            _concept["@ValorUnitario"]    = concept.precioart;
                            _concept["@Cantidad"]         = concept.cantidadart;
                            _concept["@ClaveUnidad"]      = concept.ClaveUnidad;
                            _concept["@Unidad"]           = concept.unidadart;
                            _concept["@Descripcion"]      = concept.Descripcion;
                            _concept["@ClaveProdServ"]    = concept.claveProdServ;
                            _concept["@Importe"]          = concept.importeart;
                            _concept["@NoIdentificacion"] = concepts["NoIdentificacion"];

                            _transfers["@Base"]          = concept.precioart;
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
        jsonxmlBase["cfdi:Comprobante"]["@Subtotal"]    = Subtotal;
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

        return jsonxmlBase;
    }

    sendFile( xmlString: string ){
        var xmlBlob = new Blob([ xmlString ], {"type": "text/xml"}),
            pdfBlob = new Blob([ xmlString ], {"type": "text/pdf"});

        let _billing    = {
            "_id": "One",
            "_attachments": {
                "Factura.xml": {
                    "content_type": 'text/xml',
                    "data": xmlBlob
                }
            }
        };

        return this.saveXmlFile( _billing );
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