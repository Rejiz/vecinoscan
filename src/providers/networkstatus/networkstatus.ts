import { ToastController  } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Subscription} from 'rxjs/Subscription';

/*
  Generated class for the NetworkstatusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkstatusProvider {

  connected: Subscription;
  disconnected: Subscription;

  constructor(
    public http: HttpClient, 
    private toastCtrl:ToastController,
    private network: Network) {
    console.log('Hello NetworkstatusProvider Provider');
  }

  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type;
    this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }
  checkNetwork(){
    this.connected = this.network.onConnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
   
    this.disconnected = this.network.onDisconnect().subscribe(data => {
      console.log(data)
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }
  leaveNetwork(){
    this.connected.unsubscribe();
    this.disconnected.unsubscribe();
  }
}
