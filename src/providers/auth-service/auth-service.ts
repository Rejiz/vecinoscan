import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
//let apiUrl = "http://localhost/PHP-Slim-Restful/api/";
let apiUrl = 'https://api.thewallscript.com/restful/';
// let apiUrl = 'http://localhost:8888/PHP-Slim-Restful-master/api/';

@Injectable()

export class AuthServiceProvider {

  constructor(public http: Http) {
  }
  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();

      this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });

  }

}
