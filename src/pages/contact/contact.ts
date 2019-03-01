import { Component, NgZone } from '@angular/core';
import { App, NavController, ToastController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";
import { FeedUpdatesProvider } from '../../providers/feed-updates/feed-updates';
import { Network } from '@ionic-native/network';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import { DatabaseProvider } from '../../providers/database/database';
import { CommonProvider } from "../../providers/common/common";
import { Badge } from '@ionic-native/badge';
import { LoginPage } from './../login/login';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  
  public items : Array<any> = [];
  public hide:boolean = false;
  public hideForm        : boolean = false;
  public showOn        : boolean = false;
  public recordId        : any;
  public hasComics     : boolean = false;
  public hasOnline     : boolean = false;
  public hasRecords     : boolean = false;
  public comics        : any;
  public scans        : any;
  public revisionId    : any;
  public userDetails : any;
  public resposeData : any;
  public dataSet : any;
  public noRecords: boolean;

  userPostData = {
    method: "",
    user_id: "",
    token: "",
    feed: "",
    feed_id: "",
    date: "",
    idqr: "",
    qr_code: ""
  };
  qrPostData = {
    method: "",
    user_id: "",
    token: "",
  };
  postList = [];

  constructor(
    public app: App,
    public navCtrl: NavController,
    public authService:AuthServiceProvider, 
    public dataFu:FeedUpdatesProvider,
    private toastCtrl: ToastController,
    private network: Network,
    public DB : DatabaseProvider,
    public common : CommonProvider,
    private zone: NgZone,
    private alertCtrl: AlertController,
    private badge: Badge) {

    var offline = Observable.fromEvent(document, "offline");
    var online = Observable.fromEvent(document, "online");

    offline.subscribe(() => {
      this.zone.run(() => {
        this.hide = true;
        this.hasRecords = false;
      });
    });

    online.subscribe(()=>{
      this.DB.retrieveComics().then((data)=>
     {
        let existingData = Object.keys(data[0]).length;
        if(existingData !== 0)
        {
          this.zone.run(() => {
            this.hide = false;
            this.hasRecords = true;
          });
        }
     });

    });
  }
  //  ALERTAS EN CASO DE NO ENCONTRAR EL CODIGO QR (ONLINE-OFFLINE)
  presentAlert(titulo, mensaje) {
    this.dataFu.errorData = undefined;
    this.dataFu.errorDatanet = undefined;
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Cerrar']
    });
    alert.present();

  }
  //  FUNCIONES AL ENTRAR AL MENU REGISTROS
  ionViewWillEnter(){
    if(this.dataFu.paramData && this.dataFu.idQr && this.dataFu.fechaData){
      if(this.network.type != 'none'){
        this.feedUp(this.dataFu.paramData, this.dataFu.idQr, this.dataFu.fechaData);
      }else{
        this.saveComicUp(this.dataFu.paramData, this.dataFu.fechaData, this.dataFu.idQr);
      }
    }
    if(this.network.type != 'none'){
      this.getFeed();
      this.displayComics();
      this.hide = true;
    }else{
      this.displayComics();
    }
    
    if(this.dataFu.errorData == true){
      this.presentAlert('Codigo Invalido', 'Actualizar registro de ubicaciones.');
    }else if(this.dataFu.errorDatanet == true){
      this.presentAlert('Codigo no Encontrado', 'Intenta actualizar el registro de ubicaciones.');
    }
  }
  // MUESTRA LOS REGISTROS DE LA BASE DE DATOS (ONLINE)
  getFeed() {

    this.zone.run(() => {
      this.hide = true;
      this.hasOnline  = true;
    });
    this.userPostData = {
      method: "",
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      date: "",
      idqr: "",
      qr_code: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = this.dataFu.paramData;
    this.userPostData.method = "get_user_checks";
    this.common.presentLoading();
    this.authService.postData(this.userPostData, "feed").then(
      result => {
        this.resposeData = result;
        console.log(result);
        if (this.resposeData.checks) {
          this.common.closeLoading();
          this.dataSet = this.resposeData.checks;
          const dataLength = this.resposeData.checks.length;
          this.userPostData.date = this.resposeData.checks[
            dataLength - 1
          ].created;
        } else {
          this.common.closeLoading();
          this.navCtrl.parent.select(0);

          console.log("No access");
        }
      },
      err => {
        //Connection failed message
      }
    );
  }
  // AGREGA REGISTRO DIRECTAMENTE ALA BASE DEDATOS (ONLINE)
  feedUp(texto, idqr, fecha){
    this.userPostData = {
      method: "",
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      date: "",
      idqr: "",
      qr_code: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = texto;
    this.userPostData.date = fecha;
    this.userPostData.idqr = idqr;
    this.userPostData.qr_code = idqr;
    this.userPostData.method = "post_check";
    if (this.userPostData.feed) {
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData["feedData"]) {
            this.dataSet.unshift(this.resposeData["feedData"]);
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
    this.dataFu.idQr = undefined;
  }
  // AGREGA REGISTROS PENDIENTES UNO POR UNO A LA BASE DE DATOS (ONLINE)
  feedUps(texto, fecha, activo, ide, rev, idqri){
    this.userPostData = {
      method: "",
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      date: "",
      idqr: "",
      qr_code: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = texto;
    this.userPostData.date = fecha;
    this.userPostData.idqr = idqri;
    this.userPostData.qr_code = idqri;
    this.userPostData.method = "post_check";
    if (this.userPostData.feed) {
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData["feedData"]) {
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

    this.DB.retrieveComic(ide)
    .then((doc)=>
    {
       return this.DB.removeComic(ide, rev);
    })
    .then((data) =>
    {
      this.navCtrl.setRoot(this.navCtrl.getActive().component);
    })
    .catch((err)=>
    {
       console.log(err);
    });
    
    this.zone.run(() => {
        this.hide = true;
    });
    this.dataFu.paramData = undefined;
    this.dataFu.fechaData = undefined;
    this.dataFu.idQr = undefined;
  }
  // AGREGA LOS REGISTROS PENDIENTES A LA BASE DE DATOS (ONLINE)
  feedScans(texto, fecha, activo, ide, rev, idqri){
    this.userPostData = {
      method: "",
      user_id: "",
      token: "",
      feed: "",
      feed_id: "",
      date: "",
      idqr: "",
      qr_code: ""
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.userPostData.user_id = this.userDetails.user_id;
    this.userPostData.token = this.userDetails.token;
    this.userPostData.feed = texto;
    this.userPostData.date = fecha;
    this.userPostData.idqr = idqri;
    this.userPostData.qr_code = idqri;
    this.userPostData.method = "post_check";
    if (this.userPostData.feed) {
      this.authService.postData(this.userPostData, "feedUpdate").then(
        result => {
          this.resposeData = result;
          if (this.resposeData["feedData"]) {
            this.dataSet.unshift(this.resposeData["feedData"]);
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

    this.dataFu.paramData = undefined;
    this.dataFu.fechaData = undefined;
    this.dataFu.idQr = undefined;
  }
  // AGREGA REGISTRO PENDIENTE (OFFLINE)
  saveComicUp(texto, fecha, qride){
      var activo = false;
      let character : string     = texto,
          rating    : number     = fecha,
          active    : boolean     = activo,
          qrid    : number     = qride;
         //id      : any        = this.recordId;

        this.DB.addComic(character, rating, active, qrid)
        .then((data) =>
        {
            this.sendNotification(`${character} se agrego tu registro`);
            this.displayComics();
        });
  }
  // MUESTRA LOS REGISTROS EN BASE DE DATOS LOCAL (OFFLINE)
  displayComics(){

      this.DB.retrieveComics().then((data)=>
     {
        let existingData = Object.keys(data[0]).length;
        this.badge.set(data[1]);
        if(existingData !== 0)
        {

                if(this.network.type != 'none'){
                  this.showOn  = true;
                }
                this.zone.run(() => {
                  this.hasComics  = true;
                  if(this.network.type != 'none'){
                    this.hide = false;
                    this.hasRecords = true;
                  }else{
                    this.hasRecords = false;
                    this.hide = true;
                  }
                });
                this.comics   = data[0];
                this.noRecords = false;
                this.dataFu.paramData = undefined;
                this.dataFu.fechaData = undefined;
        }
        else
        {

          this.zone.run(() => {
              this.hide = true;
              this.hasRecords = false;
          });
          this.noRecords = true;
          console.log("we get nada!");
        }
     });
  }
  // BORRA REGISTROS LOCALS Y ACTUALIZA LA BASE DE DATOS.
  displayScans(){
      this.DB.retrieveScans().then((data)=>
     {
        let existingScans = Object.keys(data[2]).length;
        if(existingScans !== 0)
        {

                this.scans   = data[2];
                for (var index1 = 0; index1 < this.scans.length; index1++) {
                  

                  this.DB.retrieveComic(this.scans[index1]['id'])
                  .then((doc)=>
                  {
                     return this.DB.removeComic(doc[0].id, doc[0].rev);
                  })
                  .then((data) =>
                  {
  
                  })
                  .catch((err)=>
                  {
                     console.log(err);
                  });

                  this.feedScans(this.scans[index1]['character'], this.scans[index1]['rating'], this.scans[index1]['active'], this.scans[index1]['id'], this.scans[index1]['rev'], this.scans[index1]['qrid']);

                }

          this.zone.run(() => {
            this.hasComics = false;
            this.noRecords = true;
            this.hide = true;
          });
          this.getFeed();
        }
        else
        {
          console.log("we get nada!");
        }


     });
  }
  // CONFIRMACION DE ENVIO DE REGISTROS PENDIENTES (TODOS)
  confirmScans() {
    let alert = this.alertCtrl.create({
      title: 'Enviar Registros?',
      message: 'Se enviaran todos los registros pendientes.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Enviar',
          handler: () => {
            this.displayScans();
          }
        }
      ]
    });
    alert.present();
  }
  // CALLBACK NOTIFICACIONES
  sendNotification(message)  : void{
     let notification = this.toastCtrl.create({
            message    : message,
            duration     : 3000,
            position: 'bottom'
       });
     notification.present();
  }
  // FUNCION BOTON ACTUALIZAR VISTA
  updatePage(){
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
    this.dataFu.updateData = undefined;
  }
  getCheckpoints(){
    this.qrPostData = {
      user_id: "",
      method: "get_qr_codes",
      token: "",
    };
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data;
    this.qrPostData.user_id = this.userDetails.user_id;
    this.qrPostData.token = this.userDetails.token;
    this.authService.postData(this.qrPostData, "getCheck").then(
      result => {
        this.resposeData = result;
        if(this.resposeData.user_id == null){
          this.logout();
          setTimeout(() => this.presentToast("Token invalido inicia sesion de nuevo."), 1000);
        }else{
          localStorage.setItem('getScans', JSON.stringify(this.resposeData) )
          setTimeout(() => this.presentToast("Checkpoints actualizados con éxito."), 1000);
        }
      },
      err => {
        //Connection failed message
      }
    );
  }
  backToWelcome(){
    this.app.getRootNav().setRoot(LoginPage);
  }
  logout(){
    // Remove API token 
    localStorage.removeItem('userData');
    setTimeout(() => this.backToWelcome(), 1000);
  }
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000
    });
    toast.present();
  }
}
