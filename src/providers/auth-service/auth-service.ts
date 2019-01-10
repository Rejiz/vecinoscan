import { HttpClient } from '@angular/common/http';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
let getApiUrl = 'https://jsonplaceholder.typicode.com/posts';

@Injectable()

export class AuthServiceProvider {

  constructor(public http: Http) {
    console.log('Hello AuthServiceProvider Provider');
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

  // getPosts() {

  //   return  this.http.get(getApiUrl)
  //           .do((res : Response ) => console.log(res.json()))
  //           .map((res : Response ) => res.json())
  //           .catch((error:any) => {
  //             return Observable.throw(error);
  //           })
  // }
  //private getPosts(): Observable<any> {
  getPosts(): Observable<any> {
    console.log(document.location.href);
    return this.http.get(getApiUrl)
      .map((res:any)=> res.json())
      .catch((error:any) => {
        return Observable.throw(error);
      })
  }
}
