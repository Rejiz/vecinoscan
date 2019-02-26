import { LoginPage } from './../login/login';
import { Component, ViewChild } from '@angular/core';
import { App} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("updatebox") updatebox;
  public userDetails : any;
  public items : Array<any> = [];

  public resposeData : any;
  userPostData = {
    "method" : "get_user_checks",
    "user_id":"USER_ID",
    "token":"TOKEN",
  };

  constructor(
    public app: App,
    public http   : HttpClient,
    public authService:AuthServiceProvider) {

      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
  }
  ionViewWillEnter(){
    this.getCheckpoints();
  }
  getCheckpoints(){
    this.userPostData = {
      "method" : "get_user_checks",
      "user_id":"",
      "token":"",
    };

    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = '45';
    this.userPostData.token = this.userDetails.token;
    console.log(this.userPostData);
    this.authService.postData(this.userPostData, "getCheck").then(
      result => {
        console.log(result);
        this.resposeData = result;
        localStorage.setItem('getScans', JSON.stringify(this.resposeData) )
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
}
