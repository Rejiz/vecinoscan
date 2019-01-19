import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { Network } from '@ionic-native/network';

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
  userData = {"username":"", "password":""};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public authService: AuthServiceProvider, 
    private toastCtrl:ToastController,
    private network: Network) {
  }
  login(){
    if(this.userData.username && this.userData.password){
      this.authService.postData(this.userData, "login").then((result) =>{
        this.resposeData = result;
        if(this.resposeData.userData){
          localStorage.setItem('userData', JSON.stringify(this.resposeData) )
          this.navCtrl.push(TabsPage);
        }else{
          this.presentToast("Proporciona un Usuario o Contraseña validos.");
        }
      }, (err) => {
        //ERROR DE CONEXION
      });
    }else{
     this.presentToast("Ingresa Usuario y Contraseña.");
    }
    
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }

}
