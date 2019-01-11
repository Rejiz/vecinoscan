import { HttpClient } from '@angular/common/http';
import { IonicPage, NavController, NavParams, ToastController  } from 'ionic-angular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the FeedUpdatesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeedUpdatesProvider {
  public paramData: any;
  public fechaData: any;
  constructor( 
    public http: HttpClient) {
  }

}
