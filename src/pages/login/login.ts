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
    public identity: any;
    public loginForm: FormGroup;
    data: LoginInterface;

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
      this.authenticationService.logout();
  }

  doLogin( event: Event ){
    event.preventDefault();
    let load    = this.loadingCtrl.create();
    load.present( load );
    this.data    = Object.assign( this.loginForm.value, {
        //opportunity: this._return.opportunity
    });

    this.authenticationService
        .login( this.data )
        .subscribe(( response ) => {
            // console.log( response, this.authGuard.canActivate() )
            if( response.hasOwnProperty('user') && Object.keys( response.user )){
                this.identity    = response.user;
                this.identity.password    = '';
                this.authenticationService
                .login( this.data, 'true' )
                .subscribe(
                    _response => {
                        let token    = _response && _response['token'];
                        if( token ){
                            localStorage.setItem('token', token );
                            load.dismiss();
                            this.navCtrl.setRoot( TabsPage );
                        } else {
                            load.dismiss();
                            this.showAlertCode( _response );
                        }
                    }
                );
            } else {
                load.dismiss();
                this.showAlertCode( response );
            }
        },
        ( error ) => {
            console.log( error )
            load.dismiss();
            this.showAlertCode( JSON.parse( error._body ));
        });
  }

  logout(): void {
    this.authenticationService.logout();
  }

  private makeLoginForm(){
    return this.frmBuilder.group({
      // 'username': ['', [Validators.required, Validators.pattern( /^[a-zA-Z0-9_]{1,}$/ )]],
      'password': ['', [ Validators.maxLength( 20 )]],
      'email': ['', [ Validators.required ]]
    });
  }

  showAlertCode( _body: any ){
    let alert = this.alertCtrl.create({
      title: _body.title,
      subTitle: _body.message,
      buttons: [{
        text: _body.text,
        handler: data => {
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

  /* doLogin2( event: Event ){
    event.preventDefault();
    let load    = this.loadingCtrl.create();
    load.present( load );
    this.data    = Object.assign( this.loginForm.value, {
        //opportunity: this._return.opportunity
    });

    this.authenticationService
        .login( this.data )
        .subscribe(( _response ) => {
            let token    = _response && _response['token'];

            if( token ){
                load.dismiss();
                this.navCtrl.setRoot( TabsPage );
            } else {
              // this._return.result    = false;
              load.dismiss();
              this.showAlertCode( _response );
            }
        },
        ( error ) => {
            load.dismiss();
            this.showAlertCode( JSON.parse( error._body ));
        });
  } */

}
