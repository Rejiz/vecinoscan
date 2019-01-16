
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';

import { CommonProvider } from "../../providers/common/common";
import { AuthServiceProvider } from "../../providers/auth-service/auth-service";

import PouchFind from 'pouchdb-find';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {


  private _DB     : any;
  private success : boolean = true;

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
  constructor(public http: HttpClient,
              public alertCtrl : AlertController,
              public common : CommonProvider,
              public authService:AuthServiceProvider) {
  this.initialiseDB();
  }
  
  initialiseDB()
  {

      PouchDB.plugin(PouchFind);
     this._DB = new PouchDB('comics');
  }
  // ADD DATA
  addComic(character, rating, active)
  {
     var timeStamp   = new Date().toISOString(),
        //  base64String  = image.substring(23),
         comic   = {
          _id           : timeStamp,
          character       : character,
          rating        : rating,
          active            : active,
       };

     return new Promise(resolve =>
     {
        this._DB.put(comic).catch((err) =>
        {
           this.success = false;
        });
        resolve(true);

     });
  }

  // UPDATE DATA
  updateComic(id, character, rating, active, revision)
  {
     var comic    = {
            _id       : id,
            _rev        : revision,
            character   : character,
            rating      : rating,
            active        : active,
         };

     return new Promise(resolve =>
     {
        this._DB.put(comic)
        .catch((err) =>
        {
           this.success = false;
        });

        if(this.success)
        {
           resolve(true);
        }
     });
  }

  // GET SINGLE DATA
  retrieveComic(id)
  {
     return new Promise(resolve =>
     {
        this._DB.get(id, {attachments: true})
        .then((doc)=>
        {
           var item    = [];

    
           item.push(
           {
              id            :  id,
              rev           :  doc._rev,
              character     :  doc.character,
              active          :  doc.active,
              rating      :  doc.rating,
           });
           resolve(item);
        })
     });
  }

  // GET ALL DATA
  retrieveComics()
  {

     return new Promise(resolve =>
     {

PouchDB.plugin(PouchFind);
        this._DB.allDocs({include_docs: true, descending: true, attachments: false}, function(err, doc)
  {
     let k,
         items   = [],
         row   = doc.rows;

     for(k in row)
     {
        var item            = row[k].doc;

        items.push(
        {
           id      :   item._id,
           rev     :   item._rev,
           character : item.character,
           active      : item.active,
           rating    : item.rating,
           //image     :   attachment
        });
     }
           resolve(items);
           console.log(items);
        });
     });
  }

  // REMOVE DATA
  removeComic(id, rev)
  {
     return new Promise(resolve =>
     {
        var comic   = { _id: id, _rev: rev };

        this._DB.remove(comic)
        .catch((err) =>
        {
           this.success = false;
        });

        if(this.success)
        {
           resolve(true);
        }
     });
  }

  // ALERT DATA
  errorHandler(err)
  {
     let headsUp = this.alertCtrl.create({
        title: 'Heads Up!',
        subTitle: err,
        buttons: ['Got It!']
     });

     headsUp.present();
  }

}