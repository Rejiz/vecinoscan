import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AlertController } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Network } from '@ionic-native/network';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { CommonProvider } from "../../providers/common/common";



@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  public items : Array<any> = [];

  public userDetails : any;
  public resposeData : any;
  getQR = {
    "method" : "get_qr_codes",
    "user_id":"",
    "token":"",
  };
  constructor(
    public navCtrl: NavController,
    private qrScanner: QRScanner,
    public alerCtrl: AlertController,
    public app: App,
    public events: Events, 
    public dataFu:FeedUpdatesProvider,
    public storage: Storage,
    public http   : HttpClient,
    private network: Network,
    public authService:AuthServiceProvider,
    public common : CommonProvider) {

  }

  //Funcion de switcheo
  switchTabs(tabNmb) {
    this.navCtrl.parent.select(tabNmb);
  }

  getCheckpoints(texto){
    this.getQR = {
      "method" : "get_qr_codes",
      "user_id":"",
      "token":"",
    };

    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.getQR.user_id = this.userDetails.user_id;
    this.getQR.token = this.userDetails.token;
    this.authService.postData(this.getQR, "getCheck").then(
      result => {
        this.resposeData = result;
        if(this.resposeData.user_id != null){
            localStorage.setItem('getScans', JSON.stringify(this.resposeData) );
            this.goToAbout(texto);
          }
      },
      err => {
        //Connection failed message
      }
    );
  }
  checkPoints(value){

    var gScans = JSON.parse(localStorage.getItem('getScans'));
    var gScansval = gScans.codes.filter(function(item) {
      return item.id === value;
    })[0];
    return gScansval;
  }
  // Captura de dato QR y Fecha
  goToAbout(texto) {
    // var gScans = JSON.parse(localStorage.getItem('getScans'));
    // var gScansval = gScans.filter(function(item) {
    //   return item.id === texto;
    // })[0];
    var lorem = this.checkPoints(texto);
    
    var mydate = new Date();
    var curr_date = mydate.getDate();
    var curr_month = mydate.getMonth()+1;
    var curr_year = mydate.getFullYear();
    
    var mydatestr = '' + curr_year  + '-' +
    curr_month + '-' + 
    curr_date+ ' ' +
    mydate.getHours() + ':' +
    mydate.getMinutes() + ':' + 
    mydate.getSeconds();
    if(lorem != undefined){
      this.dataFu.paramData = lorem['name'];
      this.dataFu.idQr = lorem['id'];
    }else{

      var loremDos = this.checkPoints(texto);
      if(loremDos != undefined){

        this.dataFu.paramData = loremDos['name'];
        this.dataFu.idQr = lorem['id'];
      }else{
        if(this.network.type != 'none'){

          this.dataFu.errorData = true;
        }else{

          this.dataFu.errorDatanet = true;
        }
      }
    }
    
    this.dataFu.fechaData = mydatestr;
    this.dataFu.updateData = true;
    this.closeScanner();
    this.switchTabs(2);
    
  }
  //FUNCION PARA ABRIR ESCANER
  scan() {
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning

            this.qrScanner.resumePreview();


          if(this.network.type != 'none'){
            this.getCheckpoints(text);
          }else{
            this.goToAbout(text);
          }
    
          });
          this.qrScanner.show();

        } else if (status.denied) {
          this.qrScanner.openSettings();
        } else {
        }
      })
      .catch((e: any) => console.log('Error is', e));
      
  }
  startScanner() {
    // Show scanner 
    const rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
    rootElement.classList.add('qr-scanner-open');
  };
  closeScannerboton() {
    // Hide and unsubscribe from scanner
    const rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
    rootElement.classList.remove('qr-scanner-open');
    // start scanning
    this.qrScanner.hide(); // hide camera preview
    this.switchTabs(0);
  };
  closeScanner() {
    // Hide and unsubscribe from scanner
    const rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
    rootElement.classList.remove('qr-scanner-open');
    // start scanning
    this.qrScanner.hide(); // hide camera preview
  };
  ionViewWillEnter(){
    this.startScanner();
    this.scan();
    // this.getCheckpoints('1001');
  }
}
