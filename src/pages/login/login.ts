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
        .subscribe(( _response ) => {
            let token    = _response && _response['token'];

            if( token ){
                load.dismiss();
                this.navCtrl.setRoot( TabsPage );
            } else {
              this._return.result    = false;
              load.dismiss();
              this.showAlertCode( _response );
            }
        },
        ( error ) => {
            load.dismiss();
            this.showAlertCode( JSON.parse( error._body ));
        });
  }

  logout(): void {
    //this.token = null;
    localStorage.removeItem('currentUser');
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

}
