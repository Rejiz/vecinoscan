import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { AlertController } from 'ionic-angular';
import { HomePage } from "../home/home";
import { Events } from 'ionic-angular';
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  constructor(public navCtrl: NavController,
    private qrScanner: QRScanner,
    public alerCtrl: AlertController,
    public app: App,
    public events: Events, 
    public dataFu:FeedUpdatesProvider) {


  }
  switchTabs(tabNmb) {
    this.navCtrl.parent.select(tabNmb);
  }
  goToAbout(texto) {
    var month=new Array();
    month[0]="Check 1";
    month[1]="Check 2";
    month[2]="Check 3";
    month[3]="Check 4";
    month[4]="Check 5";
    month[5]="Check 6";
    var id = month[texto];
    this.dataFu.paramData = id;
    var month=new Array();
    month[0]="January";
    month[1]="February";
    month[2]="March";
    month[3]="April";
    month[4]="May";
    month[5]="June";
    month[6]="July";
    month[7]="August";
    month[8]="September";
    month[9]="October";
    month[10]="November";
    month[11]="December";
    var mydate = new Date();
    var curr_date = mydate.getDate();
    var curr_month = month[mydate.getMonth()];
    var curr_year = mydate.getFullYear();
    
    var mydatestr = '' + curr_year  + ' ' +
    curr_month + ' ' + 
    curr_date+ ' ' +
    mydate.getHours() + ':' +
    mydate.getMinutes() + ':' + 
    mydate.getSeconds();

    this.dataFu.fechaData = mydatestr;
    this.switchTabs(2);
    
  }
  //scans
  scan() {
    // this.goToAbout('2');
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning

            this.qrScanner.resumePreview();

            this.closeScanner();
            this.goToAbout(text);
          });
          this.startScanner();
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

  closeScanner () {
    // Hide and unsubscribe from scanner
    const rootElement = <HTMLElement>document.getElementsByTagName('html')[0];
    rootElement.classList.remove('qr-scanner-open');
    // start scanning
    let scanSub = this.qrScanner.scan().subscribe((text: string) => {
      this.qrScanner.hide(); // hide camera preview
      scanSub.unsubscribe(); // stop scanning
    });
    this.switchTabs(0);
  };
  ionViewWillEnter(){
    this.scan();
  }
}
