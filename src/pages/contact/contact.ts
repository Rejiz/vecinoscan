import { Component } from '@angular/core';
import { NavController, ItemSliding, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  postList = [];

  constructor(public navCtrl: NavController,
    public authService:AuthServiceProvider, 
    public dataFu:FeedUpdatesProvider,
    private toastCtrl: ToastController,
    private network: Network) {
    
  }
  
}
