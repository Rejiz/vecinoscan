import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Platform, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  resposeData : any;
  userData = {"method":"login","username":"", "password":""};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider, 
    private toastCtrl:ToastController,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    private _translate 	  : TranslateService) {
  }
  login(){
    if(this.userData.username && this.userData.password){
      this.authService.postData(this.userData, "login").then((result) =>{
        this.resposeData = result;
        if(this.resposeData.user_id != null){
          localStorage.setItem('userData', JSON.stringify(this.resposeData) )
          this.navCtrl.push(TabsPage);
        }else{
          this._translate.get('error-login').subscribe(
            value => {
              // value is our translated string
              let alertTitle = value;
              this.presentToast(alertTitle);
            }
          )
        }
      }, (err) => {
        //ERROR DE CONEXION
      });
    }else{
      this._translate.get('fields-login').subscribe(
        value => {
          // value is our translated string
          let alertTitle = value;
          this.presentToast(alertTitle);
        }
      )
    }
    
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present();
  }
}
