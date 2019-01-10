import { Component, ViewChild } from '@angular/core';
import { NavController, App, AlertController, NavParams } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonProvider } from "../../providers/common/common";
import { Events } from 'ionic-angular';
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';

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
  constructor(
    public navCtrl: NavController,
    private qrScanner: QRScanner,
    public common : CommonProvider,
    public alerCtrl: AlertController,
    public app: App,
    public authService:AuthServiceProvider,
    public navParams: NavParams,
    public events: Events, 
    public dataFu:FeedUpdatesProvider
    ) {

      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.user_id = this.userDetails.user_id;
      this.userPostData.token = this.userDetails.token;
      this.userPostData.lastCreated = "";
      this.noRecords = false;
      this.getFeed();
      this.localData = this.dataFu.paramData;
      console.log(this.localData);
      if(this.localData){
        this.feedUp(this.localData);
      }

  }
  backToWelcome(){
    const root = this.app.getRootNav();
    root.popToRoot();
  }
  logout(){
    // Remove API token 
    localStorage.clear();
    //this.goToAbout(undefined);
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
  feedUp(texto){
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

    if (this.userPostData.feed) {
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData.feedData) {
            console.log(this.resposeData.feedData);
            this.dataSet.unshift(this.resposeData.feedData);

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
  ionViewWillEnter(){
    //this.feedUpdate();
  }
  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.dataSet = [];
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
