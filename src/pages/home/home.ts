import { LoginPage } from './../login/login';
import { Component, ViewChild } from '@angular/core';
import { NavController, App, AlertController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonProvider } from "../../providers/common/common";
import { Events } from 'ionic-angular';
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild("updatebox") updatebox;
  public localData: any;
  public userDetails : any;
  public resposeData : any;
  public dataSet : any;
  public noRecords: boolean;
  userPostData = {
    user_id: "",
    token: "",
    feed: "",
    feed_id: "",
    lastCreated: ""
  };
  public items : Array<any> = [];
  constructor(
    public navCtrl: NavController,
    private qrScanner: QRScanner,
    public common : CommonProvider,
    public alerCtrl: AlertController,
    public app: App,
    public authService:AuthServiceProvider,
    public navParams: NavParams,
    public events: Events, 
    public dataFu:FeedUpdatesProvider,
    public http   : HttpClient) {

      this.getScans();
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.user_id = this.userDetails.user_id;
      this.userPostData.token = this.userDetails.token;
      this.userPostData.lastCreated = "";
      this.noRecords = false;
  }
  // OBTENER INFORMACION DESDE MYSQL
  getScans() {
    this.http
    .get('http://api.penascotoday.com/api/getScans')
    .subscribe((data : any) =>
    {
       this.items = data;
       localStorage.setItem('getScans', JSON.stringify(this.items) )
    },
    (error : any) =>
    {
       console.dir(error);
    });
  }
  backToWelcome(){
    this.app.getRootNav().setRoot(LoginPage);
  }
  logout(){
    // Remove API token 
    localStorage.removeItem('userData');
    this.goToAbout(undefined);
    setTimeout(() => this.backToWelcome(), 1000);
  }
  //scans
  getFeed() {
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
  switchTabs(tabNmb) {
    this.navCtrl.parent.select(tabNmb);
  }
  goToAbout(texto) {
    this.dataFu.paramData = texto;
    this.switchTabs(0);
  }
  feedUpdate() {
    if (this.userPostData.feed) {
      this.common.presentLoading();
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData.feedData) {
            this.common.closeLoading();
            this.dataSet.unshift(this.resposeData.feedData);
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
  }
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
      this.common.presentLoading();
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          console.log(result);
          this.resposeData = result;
          if (this.resposeData.feedData) {
            this.common.closeLoading();
            this.dataSet.unshift(this.resposeData.feedData);
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
  feedDelete(feed_id, msgIndex) {
    if (feed_id > 0) {
      let alert = this.alerCtrl.create({
        title: "Delete Feed",
        message: "Do you want to buy this feed?",
        buttons: [
          {
            text: "Cancel",
            role: "cancel",
            handler: () => {
              console.log("Cancel clicked");
            }
          },
          {
            text: "Delete",
            handler: () => {
              this.userPostData.feed_id = feed_id;
              this.authService.postData(this.userPostData, "feedDelete").then(
                result => {
                  this.resposeData = result;
                  if (this.resposeData.success) {
                    this.dataSet.splice(msgIndex, 1);
                  } else {
                    console.log("No access");
                  }
                },
                err => {
                  //Connection failed message
                }
              );
            }
          }
        ]
      });
      alert.present();
    }
  }
  doInfinite(e): Promise<any> {
    console.log("Begin async operation");
    return new Promise(resolve => {
      setTimeout(() => {
        this.authService.postData(this.userPostData, "feed").then(
          result => {
            this.resposeData = result;
            if (this.resposeData.feedData.length) {
              const newData = this.resposeData.feedData;
              this.userPostData.lastCreated = this.resposeData.feedData[
                newData.length - 1
              ].created;
              
              for (let i = 0; i < newData.length; i++) {
                this.dataSet.push(newData[i]);
              }
            } else {
              this.noRecords = true;
              console.log("No user updates");
            }
          },
          err => {
            //Connection failed message
          }
        );
        resolve();
      }, 500);
    });
  }
  converTime(time) {
    let a = new Date(time * 1000);
    return a;
  }
  refresh(){
    this.dataSet = [];
    this.noRecords = false;
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

    this.authService.postData(this.userPostData, "feed").then(
      result => {
        console.log(result);
        this.resposeData = result;
        if (this.resposeData.feedData) {
          this.dataSet = this.resposeData.feedData;
          const dataLength = this.resposeData.feedData.length;
          this.userPostData.lastCreated = this.resposeData.feedData[
            dataLength - 1
          ].created;
        } else {
          console.log("No access");
        }
      },
      err => {
        //Connection failed message
      }
    );
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.dataSet = [];
    this.noRecords = false;
    //this.getFeed();
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

    this.authService.postData(this.userPostData, "feed").then(
      result => {
        console.log(result);
        this.resposeData = result;
        if (this.resposeData.feedData) {
          this.dataSet = this.resposeData.feedData;
          const dataLength = this.resposeData.feedData.length;
          this.userPostData.lastCreated = this.resposeData.feedData[
            dataLength - 1
          ].created;
        } else {
          console.log("No access");
        }
      },
      err => {
        //Connection failed message
      }
    );



    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }
}
