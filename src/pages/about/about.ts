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
    this.switchTabs(0);
    console.log(texto);
  }
  //scans
  scan() {
    this.goToAbout('text');
    // Optionally request the permission early
    // this.qrScanner.prepare()
    //   .then((status: QRScannerStatus) => {
    //     if (status.authorized) {
    //       // camera permission was granted

    //       // start scanning
    //       let scanSub = this.qrScanner.scan().subscribe((text: string) => {
    //         this.qrScanner.hide(); // hide camera preview
    //         scanSub.unsubscribe(); // stop scanning
    //         // hack to hide the app and show the preview

    //         this.qrScanner.resumePreview();

    //         this.closeScanner();
    //         // ALERT TEXT
    //         // let alert = this.alerCtrl.create({
    //         //   title: text,
    //         //   message: text,
    //         //   buttons: ['Ok']
    //         // });
    //         // alert.present();

    //         // UPDATE FEED ¬ RETURN TAB #3
    //         this.goToAbout(text);
    //       });
    //       // show camera preview
    //       this.startScanner();
    //       this.qrScanner.show();

    //     } else if (status.denied) {
    //       // camera permission was permanently denied
    //       // you must use QRScanner.openSettings() method to guide the user to the settings page
    //       // then they can grant the permission from there
    //       this.qrScanner.openSettings();
    //     } else {
    //       // permission was denied, but not permanently. You can ask for permission again at a later time.
    //     }
    //   })
    //   .catch((e: any) => console.log('Error is', e));
      
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
