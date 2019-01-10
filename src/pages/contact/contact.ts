import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  postList = [];

  constructor(public navCtrl: NavController,
    public authService:AuthServiceProvider, 
    public dataFu:FeedUpdatesProvider) {
      this.getPosts();
  }

  getPosts(){
    this.authService.getPosts().subscribe((data)=>{
        this.postList = data;
    });
  }
}
