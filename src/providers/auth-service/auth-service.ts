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
let apiUrl = 'https://api.penascotoday.com/api/';
// let apiUrl = 'https://api.thewallscript.com/restful/';
// let apiUrl = 'http://localhost:8888/PHP-Slim-Restful-master/api/';

@Injectable()

export class AuthServiceProvider {

  constructor(private http: Http) {
  }
  postData(credentials, type) {
    return new Promise((resolve, reject) => {
      // let headers 	: any		= new HttpHeaders({ 'Content-Type': 'application/json' });
      // let headers = new Headers({'Accept': 'application/json', 'Content-Type': 'text/plain'});
      var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // let headers = new Headers({'Content-Type': 'application/json'});

      this.http.post(apiUrl + type, JSON.stringify(credentials), { headers: headers })
        .subscribe(res => {
          resolve(res.json());
          console.log(res);
        }, (err) => {
          console.log(err);
          reject(err);
        });

        // this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
        // .then(data => {

        //   resolve(data);
        //   console.log(data);
        //   console.log(data.status);
        //   console.log(data.data); // data received by server
        //   console.log(data.headers);

        // })
        // .catch(error => {

        //   reject(error);
        //   console.log(error);
        //   console.log(error.status);
        //   console.log(error.error); // error message as string
        //   console.log(error.headers);

        // });
    });

  }

}
