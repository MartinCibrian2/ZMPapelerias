import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { delay } from 'rxjs/operators';

import { AppSettings } from '../../app/common/api.path';
import { AuthenticationService } from '../authentication.service';

@Injectable()

export class UserService
{
    public token: String;
    public apiUrl: String;
    private apiPaths;

    constructor(
        private httpClient: HttpClient,
        private http: Http,
        public appSettings: AppSettings,
        private _authService: AuthenticationService
    ){
        var currentUser    = this._authService.getToken();
        this.token         = currentUser && currentUser["token"];
        this.apiUrl        = appSettings.path_api;
    }

    getUsers( params: any ): Observable <any> {
        if( params == null ){
            params   = '';
        } else {
            params    = 'params=' + JSON.stringify( params );
        }
        // For users
        let _users$    = this
            .http
            .post(
                this.apiUrl + 'get-users/0',
                params,
                this.getHeaders()
            ).map(( res: Response ) => { return res.json() });

        return _users$;
    }

    addUser( token, user ){
        let params = JSON.stringify( user );
        let headers = this.getHeaders();

        headers.headers.append('Authorization', token );

        return this.http
        .post( this.apiUrl + 'register-user', params, headers )
        .map( res => res.json() );
    }

    editUser( token, user, id ){
        let params = JSON.stringify( user );
        let headers = this.getHeaders();

        headers.headers.append('Authorization', token );

        return this.http
        .post( this.apiUrl + 'edit-user/' + id, params, headers )
        .map( res => res.json() );
    }

    getHeaders(){
        const headers = new Headers({'Content-Type': 'application/json'});

        return { headers: headers };
    }

}


// Format date
/* 
var objToday = new Date(),
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	dayOfWeek = weekday[objToday.getDay()],
	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()],
	curYear = objToday.getFullYear(),
	curHour = objToday.getHours() > 12 ? objToday.getHours() - 12 : (objToday.getHours() < 10 ? "0" + objToday.getHours() : objToday.getHours()),
	curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes(),
	curSeconds = objToday.getSeconds() < 10 ? "0" + objToday.getSeconds() : objToday.getSeconds(),
	curMeridiem = objToday.getHours() > 12 ? "PM" : "AM";
var today = curHour + ":" + curMinute + "." + curSeconds + curMeridiem + " " + dayOfWeek + " " + dayOfMonth + " of " + curMonth + ", " + curYear;
 */