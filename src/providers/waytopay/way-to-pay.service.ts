import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { Headers, Response, RequestOptions } from '@angular/http';

import { AppSettings } from '../../app/common/api.path';

@Injectable()

export class WayToPayService
{
    public waystopay: any[];

    constructor(
        private httpClient: HttpClient,
        private appSetting: AppSettings
    ){

    }

    getWaysToPay(): Observable <any> {
        let _urlJson = '../../' + 
            this.appSetting._urlConfigs +
            'data/catalogs/forma-pago.json';

        return this.httpClient.get( _urlJson );
    }

    postWayToPay( wayToPay: any ){
        let _headers    = new Headers({'Content-Type': 'application/json'});
        let options    = new RequestOptions({ "headers": _headers });
        let body       = JSON.stringify( wayToPay );

        return this.httpClient
        .post('/app/food', body, _headers )
        .map(( res:Response ) => res.json() );
    }

    /* getBooksAndMovies(){
      return Observable.forkJoin(
        this.http.get('/app/books.json')
            .map(( res:Response ) => res.json()),
        this.http.get('/app/movies.json')
            .map(( res:Response ) => res.json())
      )
    } */

}