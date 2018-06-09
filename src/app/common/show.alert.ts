import { Injectable } from '@angular/core';
import { ActionSheetController, LoadingController, AlertController, ToastController, Loading } from 'ionic-angular';

@Injectable()
export class ShowAlert {
    public loading: Loading;

    constructor(
        public loadingCtrl: LoadingController,
        public alertCtrl: AlertController,
        public actionSheetCtrl: ActionSheetController,
        public toastCtrl: ToastController
    ){}

    showAlertCode( _body: any ){
        let alert    = this.alertCtrl.create({
            title: _body.title,
            subTitle: _body.subTitle,
            buttons: [{
                text: _body.text,
                handler: data => {
                    if( _body.hasOwnProperty('callback')){
                        _body.callback();
                    } else {
                        // There is not a callback.
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

    /*public presentActionSheet( takePicture: any, pictureSourceType: any ){
        let actionSheet    = this.actionSheetCtrl.create({
        title: 'Select Image Source',
        buttons: [
            {
                text: 'Load from Library',
                handler: () => {
                    takePicture( pictureSourceType.PHOTOLIBRARY );
                }
            }, {
                text: 'Use Camera',
                handler: () => {
                    takePicture( pictureSourceType.CAMERA );
                }
            }, {
                text: 'Cancel',
                role: 'cancel'
            }
        ]
        });
        actionSheet.present();
    }*/

}
