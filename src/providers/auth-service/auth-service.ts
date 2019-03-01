import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiUrl = 'https://www.vecinoapp.com/api/security/';

@Injectable()

export class AuthServiceProvider {

  constructor(private http: Http) {
  }
  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=UTF-8');
      this.http.post(apiUrl, JSON.stringify(credentials), {  })
        .subscribe(res => {
          console.log(res);
          resolve(res.json());
        }, (err) => {
          console.log(err);
          reject(err);
        });
    });

  }

}
