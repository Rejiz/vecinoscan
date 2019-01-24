import { HttpClient } from '@angular/common/http';
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
  public idQr: any;
  public fechaData: any;
  public updateData: any;
  public errorData: any;
  public errorDatanet: any;
  constructor( 
    public http: HttpClient) {
  }

}
