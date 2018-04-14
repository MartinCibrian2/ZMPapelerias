import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Http, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { contentHeaders } from '../../app/common/headers';
import { AuthenticationService } from '../../providers/authentication.service';
import { AuthGuard } from '../../app/common/auth.guard';
import { LoginInterface } from '../../app/interfaces/login';

import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {
    private header  = contentHeaders;
    private _return = {
        result: true,
        opportunity: 0,
        opportunities: 5
    };
    public token: string;
    loginForm: FormGroup;
    data: LoginInterface;
    timer: any = {
        'm': 0,
        's': 0
    };

  constructor(
    public navCtrl: NavController,
    //private http: Http,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public frmBuilder: FormBuilder,
    public authGuard: AuthGuard,
    private authenticationService: AuthenticationService
  ){
    this.loginForm     = this.makeLoginForm();
  }

  ngOnInit( ){
      //this.authenticationService.logout();
  }

  doLogin( event: Event ){
    event.preventDefault();
    let load    = this.loadingCtrl.create();
    load.present( load );

    //this.header.append('withCredentials', 'true');
    //this.header.append('token', `${this.token}` );

    this.data    = Object.assign( this.loginForm.value, {
        //opportunity: this._return.opportunity
    });

    this.authenticationService
        .login( this.data )
        .subscribe(( _response ) => {

            //let token    = _response && _response['token'];

            if( Object.keys( _response ).length ){ // token
                load.dismiss();
                this.navCtrl.setRoot( TabsPage );
            } else {
              this._return.result            = false;
              //this._return.opportunity      = _response['opportunity'];
              //this._return.opportunities    = _response['opportunities'];

              load.dismiss();
              //if( _response['showAlertCode'].value ){
                  //if( _response['opportunity'] >= _response['opportunities'] ){
                      /* _response['showAlertCode'].message.callback    = () => {
                          this.timer.m    = _response['timewait'];

                          let IntIdS    = setInterval(( ) => {
                                  if( this.timer.m > 0 && this.timer.s < 1 ){
                                      this.timer.s    = 60;
                                      this.timer.m --;
                                  } else {
                                  // Continues with the counting.
                                  }
                                  this.timer.s --; console.log( this.timer.m+' : '+this.timer.s );
                              }, 1000 
                          );
                          setTimeout(( ) => {
                              console.log(' Se activo el botón ingresar');
                              //this._return.opportunity = 0;
                              clearInterval( IntIdS );
                          }, (( _response['timewait'] * 60 * 1000 )) + 10 );
                      }; */
                  //}
                  //this.showAlertCode( _response['showAlertCode'].message );
              //} else {
              //    // Does not show a message.
              //}
          }
        },
        ( error ) => {
            load.dismiss();
            //let _body$    = JSON.parse( error._body );

            this.showAlertCode({
              'title': 'Acceso incorrecto',
              'subTitle': 'Intente de nuevo', // _body$.msg
              'text': 'Ok'
            });
        });
  }

  logout(): void {
    //this.token = null;
    localStorage.removeItem('currentUser');
  }

  private makeLoginForm(){
    return this.frmBuilder.group({
      'username': ['', [Validators.required, Validators.pattern( /^[a-zA-Z0-9_]{1,}$/ )]],
      'password': ['', [ Validators.maxLength( 20 )]],
      'email': ['']
      //'code': ['227859', [ Validators.minLength( 6 ), Validators.maxLength( 6 ), Validators.pattern( /^[0-9]{1,}$/ )]],
      //'opportunity': [ 0 ]
    });
  }

  showAlertCode( _body: any ){
    let alert = this.alertCtrl.create({
      title: _body.title,
      subTitle: _body.subTitle,
      buttons: [{
        text: _body.text,
        handler: data => {
          console.log('Código enviado ', data );
          if( _body.hasOwnProperty('callback')){
            _body.callback();
          }
        }
      }]
    });
    alert.present();
    alert.onDidDismiss(
      data => {
        console.log('Closed');
      }
    );
  }

}
