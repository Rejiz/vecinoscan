import { Component, NgZone } from '@angular/core';
import { NavController, ItemSliding, ToastController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';
import { Network } from '@ionic-native/network';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { DatabaseProvider } from '../../providers/database/database';

import { CommonProvider } from "../../providers/common/common";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  
  public hide:boolean = false;
  public hideForm        : boolean = false;
  public showOn        : boolean = false;
  public recordId        : any;
  public hasComics     : boolean = false;
  public hasOnline     : boolean = false;
  public comics        : any;
  public revisionId    : any;
  public userDetails : any;
  public resposeData : any;
  public dataSet : any;

  userPostData = {
    user_id: "",
    token: "",
    feed: "",
    feed_id: "",
    lastCreated: ""
  };
  postList = [];

  constructor(public navCtrl: NavController,
    public authService:AuthServiceProvider, 
    public dataFu:FeedUpdatesProvider,
    private toastCtrl: ToastController,
    private network: Network,
    public DB : DatabaseProvider,
    public common : CommonProvider,
    private zone: NgZone) {

      if(this.network.type != 'none'){
      this.hide =false;
      }else{
      this.hide =true;
      }
    var offline = Observable.fromEvent(document, "offline");
    var online = Observable.fromEvent(document, "online");

    offline.subscribe(() => {
      this.zone.run(() => {
        this.hide =true;
      });
      console.log('offline');
    });

    online.subscribe(()=>{
      this.zone.run(() => {
        this.hide =false;
      });
      console.log('online');

    });
  }
  
  //  FUNCIONES AL ENTRAR
  ionViewWillEnter(){
    
    if(this.dataFu.paramData && this.dataFu.fechaData){
      this.saveComicUp(this.dataFu.paramData, this.dataFu.fechaData);
      if(this.network.type != 'none'){
        this.feedUp(this.dataFu.paramData, this.dataFu.fechaData);
      }
    }
      this.displayComics();
  }
  checkStatus(){

    this.network.onConnect().subscribe(data => {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));

    this.network.onDisconnect().subscribe(data => {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
      this.displayNetworkUpdate(data.type);
    }, error => console.error(error));
  }
  // OBTENER INFORMACION DESDE MYSQL
  getFeed() {
    this.hasComics  = false;
    this.hasOnline  = true;
    this.userPostData = {
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      lastCreated: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = this.dataFu.paramData;
    this.common.presentLoading();
    this.authService.postData(this.userPostData, "feed").then(
      result => {
        this.resposeData = result;
        if (this.resposeData.feedData) {
          this.common.closeLoading();
          this.dataSet = this.resposeData.feedData;
          const dataLength = this.resposeData.feedData.length;
          this.userPostData.lastCreated = this.resposeData.feedData[
            dataLength - 1
          ].created;
          console.log(this.dataSet);
        } else {
          console.log("No access");
        }
      },
      err => {
        //Connection failed message
      }
    );
  }
  // ACTUALIZAR INFORMACION MYSQL
  feedUp(texto, fecha){
    this.userPostData = {
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      lastCreated: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = this.dataFu.paramData;
    //this.userPostData.lastCreated = fecha;
    if (this.userPostData.feed) {
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          console.log(result);
          this.resposeData = result;
          if (this.resposeData.feedData) {
            // this.dataSet.unshift(this.resposeData.feedData);
           this.hasComics  = false;
           this.hasOnline  = true;
            this.userPostData.feed = "";

            //this.updatebox.setFocus();
            setTimeout(() => {
              //  this.updatebox.focus();
            }, 150);
          } else {
            console.log("No access");
          }
        },
        err => {
          //Connection failed message
        }
      );
    }
    this.dataFu.paramData = undefined;
    this.dataFu.fechaData = undefined;
  }
  // ACTUALIZAR INFORMACION MYSQL
  feedUps(texto, fecha, activo, ide, rev){
    this.userPostData = {
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      lastCreated: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = texto;
    this.userPostData.lastCreated = fecha;
    if (this.userPostData.feed) {
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          console.log(result);
          this.resposeData = result;
          if (this.resposeData.feedData) {
            // this.dataSet.unshift(this.resposeData.feedData);
            this.userPostData.feed = "";

            //this.updatebox.setFocus();
            setTimeout(() => {
              //  this.updatebox.focus();
            }, 150);
          } else {
            console.log("No access");
          }
        },
        err => {
          //Connection failed message
        }
      );
    };
    let character : string     = texto,
    rating    : string     = fecha,
    active    : boolean     = true,
    revision  : string     = rev,
    id      : any        = ide;
    this.DB.updateComic(id, character, rating, active, revision)
    .then((data) =>
    {
       this.hideForm     = true;
       
       this.sendNotification(`${character} was updated in your comic characters list`);
       this.navCtrl.setRoot(this.navCtrl.getActive().component);

    });
    this.dataFu.paramData = undefined;
    this.dataFu.fechaData = undefined;
  }
  // ACTUAIZAR INFORMACION LOCAL
  saveComicUp(texto, fecha){
    if(this.network.type != 'none'){
      var activo = true;
    }else{
      var activo = false;
    }
     let character : string     = texto,
         rating    : number     = fecha,
         active    : boolean     = activo,
         id      : any        = this.recordId;

        this.DB.addComic(character, rating, active)
        .then((data) =>
        {
           this.sendNotification(`${character} se agrego tu registro`);
        });
  }
  // MOSTRAR INNFORMACIÓN LOCAL
  displayComics(){
      this.DB.retrieveComics().then((data)=>
     {
        let existingData = Object.keys(data).length;
        if(existingData !== 0)
        {

                if(this.network.type != 'none'){
                  this.showOn  = true;
                }
                this.hasComics  = true;
                this.comics   = data;
                this.dataFu.paramData = undefined;
                this.dataFu.fechaData = undefined;
        }
        else
        {
          console.log("we get nada!");
        }
     });
  }
  // AGREGAR INFORMACIÓN DESDE UN FORM
  addCharacter(){
     this.navCtrl.push('AddPage');
  }
  // EDIAR INFORMACION DESDE UN FORM
  viewCharacter(param){
     this.navCtrl.push('AddPage', param);
  }
  // CALLBACK NOTIFICACIONES
  sendNotification(message)  : void{
     let notification = this.toastCtrl.create({
            message    : message,
            duration     : 3000
       });
     notification.present();
  }
  displayNetworkUpdate(connectionState: string){
    let networkType = this.network.type
    this.toastCtrl.create({
      message: `You are now ${connectionState} via ${networkType}`,
      duration: 3000
    }).present();
  }
}
