import { LoginPage } from './../login/login';
import { Component, ViewChild } from '@angular/core';
import { App} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("updatebox") updatebox;
  public userDetails : any;
  public items : Array<any> = [];
  constructor(
    public app: App,
    public http   : HttpClient) {
      this.getScans();
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
  }
  // OBTENER INFORMACION DESDE MYSQL
  getScans() {
    this.http
    .get('http://api.penascotoday.com/api/getScans')
    .subscribe((data : any) =>
    {
       this.items = data;
       localStorage.setItem('getScans', JSON.stringify(this.items) )
    },
    (error : any) =>
    {
       console.dir(error);
    });
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
