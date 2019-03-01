import { LoginPage } from './../login/login';
import { Component, ViewChild } from '@angular/core';
import { App, ToastController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import {enableProdMode} from '@angular/core';

enableProdMode();
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("updatebox") updatebox;
  public userDetails : any;
  public items : Array<any> = [];

  public resposeData : any;
  getQR = {
    "method" : "get_user_checks",
    "user_id":"USER_ID",
    "token":"TOKEN",
  };

  userData = {"method":"login","username":"", "password":""};
  constructor(
    public app: App,
    public http: HttpClient,
    public authService:AuthServiceProvider, 
    private toastCtrl:ToastController) {

      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data;
  }
  ionViewWillEnter(){
      this.getQrCodes();
  }
  getQrCodes(){
    this.getQR = {
      "method" : "get_qr_codes",
      "user_id":"",
      "token":"",
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.getQR.user_id = this.userDetails.user_id;
    this.getQR.token = this.userDetails.token;
    this.authService.postData(this.getQR, "getCheck").then(
      result => {
        this.resposeData = result;
        if(this.resposeData.user_id == null){
          this.logout();

          setTimeout(() => this.presentToast("Token invalido inicia sesion de nuevo."), 1000);
        }else{
          localStorage.setItem('getScans', JSON.stringify(this.resposeData) )
        }
      },
      err => {
        //Connection failed message
      }
    );
  }
  backToWelcome(){
    this.app.getRootNav().setRoot(LoginPage);
  }
  logout(){
    // Remove API token 
    localStorage.removeItem('userData');
    setTimeout(() => this.backToWelcome(), 1000);
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }
}
