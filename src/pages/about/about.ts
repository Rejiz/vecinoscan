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
    this.dataFu.paramData = texto;
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
    mydate.getSeconds()

    this.dataFu.fechaData = mydatestr;
    this.switchTabs(0);
    
  }
  //scans
  scan() {

    //this.goToAbout('text');
    // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted

          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
            // hack to hide the app and show the preview

            this.qrScanner.resumePreview();

            this.closeScanner();
            // ALERT TEXT
            // let alert = this.alerCtrl.create({
            //   title: text,
            //   message: text,
            //   buttons: ['Ok']
            // });
            // alert.present();

            // UPDATE FEED ¬ RETURN TAB #3
            this.goToAbout(text);
          });
          // show camera preview
          this.startScanner();
          this.qrScanner.show();

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
          this.qrScanner.openSettings();
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
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
