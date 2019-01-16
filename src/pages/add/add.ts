import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  public form          : FormGroup;
  public comicCharacter  : any;
  public comicRating       : any;
  public comicActive       : any;
  public characterImage    : any;
  public recordId        : any;
  public revisionId    : any;
  public isEdited        : boolean = false;
  public hideForm        : boolean = false;
  public pageTitle         : string;

  constructor(public navCtrl: NavController, 
            public navParams: NavParams,
            public fb       : FormBuilder,
            public DB         : DatabaseProvider,
            public toastCtrl    : ToastController) {
               this.form = fb.group({
                  "character"            : ["", Validators.required],
               });
               this.resetFields();
            if(navParams.get("key") && navParams.get("rev"))
            {
               this.recordId      = navParams.get("key");
               this.revisionId    = navParams.get("rev");
               this.isEdited      = true;
               this.selectComic(this.recordId);
               this.pageTitle     = 'Reenviar Check';
            }
            else
            {
               this.recordId      = '';
               this.revisionId    = '';
               this.isEdited      = false;
               this.pageTitle     = 'Create entry';
            }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }
  selectComic(id)
  {
     this.DB.retrieveComic(id)
     .then((doc)=>
     {
        this.comicCharacter    = doc[0].character;
        this.comicRating       = doc[0].rating;
        this.comicActive       = doc[0].active;
        this.recordId        = doc[0].id;
        this.revisionId      = doc[0].rev;
     });
  }
  saveComic()
  {
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
   
   let character : string     = this.form.controls["character"].value,
         rating    : string     = mydatestr,
         active    : boolean     = true,
         revision  : string     = this.revisionId,
         id      : any        = this.recordId;

     if(this.recordId !== '')
     {
        this.DB.updateComic(id, character, rating, active, revision)
    .then((data) =>
    {
       this.hideForm     = true;
       this.sendNotification(`${character} was updated in your comic characters list`);
    });
     }
     else
     {
        this.DB.addComic(character, rating, active)
        .then((data) =>
        {
           this.hideForm     = true;
           this.resetFields();
           this.sendNotification(`${character} was added to your comic characters list`);
        });
     }
  }
  deleteComic()
  {
     let character;

     this.DB.retrieveComic(this.recordId)
     .then((doc)=>
     {
        character = doc[0].character;
        return this.DB.removeComic(this.recordId, this.revisionId);
     })
     .then((data) =>
     {
        this.hideForm  = true;
        this.sendNotification(`${character} was successfully removed from your comic characters list`);
     })
     .catch((err)=>
     {
        console.log(err);
     });
  }
  resetFields() : void
  {
     this.comicRating      = "";
     this.comicCharacter       = "";
     this.comicActive      = "";
  }
  sendNotification(message)  : void
  {
     let notification = this.toastCtrl.create({
            message    : message,
            duration     : 3000
       });
     notification.present();
  }
}
