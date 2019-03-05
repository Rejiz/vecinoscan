import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Platform, ActionSheetController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiUrl = 'https://www.vecinoapp.com/api/security/';

@Injectable()

export class AuthServiceProvider {
  private data;
  constructor(private http: Http,
    public platform: Platform,
    public actionSheetCtrl:ActionSheetController,
    public _translate: TranslateService
    ) {
  }
  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
      this.http.post(apiUrl, JSON.stringify(credentials), {  })
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          console.log(err);
          reject(err);
        });
    });

  }
  choose(lang) {
    this._translate.use(lang);
  }
  getTrans(texto){
    this._translate.get(texto).subscribe(
      value => {
        this.data =  value;
      }
    );
    return this.data;
  }
  openMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: this.getTrans('language'),
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: this.getTrans('spanish'),
          handler: () => {
            console.log('Delete clicked');
            this.choose('es');
            localStorage.setItem('langData', 'es' );
          }
        },
        {
          text: this.getTrans('english'),
          handler: () => {
            console.log('Share clicked');
            this.choose('en');
            localStorage.setItem('langData', 'en' );
          }
        },
        {
          text: this.getTrans('cancel'),
          role: 'cancel', // will always sort to be on the bottom
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
}
