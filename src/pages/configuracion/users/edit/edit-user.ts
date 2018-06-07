import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../../../providers/users/users.service';
import { UsersPage } from '../users';

@IonicPage()
@Component({
  selector: 'page-user',
  templateUrl: '../add/add-user.html',
  providers: [
      UserService
  ]
})
export class EditUserPage implements OnInit
{
    public titlePage: string;
    public titleApp: string;
    // Form
    public userForm: FormGroup;
    public item: any;

    constructor(
        public navParams: NavParams,
        public navCtlr: NavController,
        public frmBuilder: FormBuilder,
        private userService: UserService
    ){
        this.titleApp     = "ZMPapelerias";
        this.titlePage    = "Registrar Usuario";
        this.userForm    = this.makeForm();
    }

    ngOnInit(){

    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad EdituserPage');
    }

    saveUser( ): void {
        if( this.userForm.valid ){
            var _doc   = this.userForm.value;

            _doc.active    = true;
            // this.userService
            // .put( _doc )
            // .then(( response ) => {
                this.navCtlr.setRoot( UsersPage );
            // })
            // .then(( error ) => {
            //     console.log( error );
            // });
        } else {
            // The form is does not valid.
        }

        return;
    }

    makeForm( ){
        let _group    = {
            'name':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'surname':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]],
            'email':  ['', [ Validators.required, Validators.pattern( /^[a-zA-Z0-9_ ]*$/ )]]
        };

        if( Object.keys( this.navParams.data ).length ){
            if( this.navParams.data.hasOwnProperty('item') ){
                this.item    = this.navParams.data.item;
                Object
                .keys( this.item )
                .forEach(( _field ) => {
                    //if( _group.hasOwnProperty( _field )){
                        let _val    = this.item[ _field ];
                        _group[ _field ]   = _val;
                    /*} else {
                        // The name field does not exist in form.
                    }*/
                });
            } else {
                // Do not sent data.
            }
        } else {
            // Do not sent data.
        }

        return this.frmBuilder.group( _group );
    }

}
