import { LoginPage } from './../pages/login/login';
import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private _translate : TranslateService) {
    platform.ready().then(() => {
      this._initTranslate();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
        if(!localStorage.getItem( 'userData' )) {
            this.rootPage = LoginPage; // user can user this.nav.setRoot(TutorialPage);
        }else{
            this.rootPage = TabsPage; // user can user this.nav.setRoot(LoginPage);
        }
      splashScreen.hide();
    });
  }
  private _initTranslate()
  {
     // Set the default language for translation strings, and the current language.
     var idioma = localStorage.getItem( 'langData' );
     if(idioma == 'en'){
        this._translate.setDefaultLang(idioma);
        if (this._translate.getBrowserLang() !== undefined){
            this._translate.use(this._translate.getBrowserLang());
        }
        else{
            this._translate.use('en'); // Set your language here
        }
     }else{
      this._translate.setDefaultLang(idioma);
      this._translate.use('es'); // Set your language here
     }


  }
}
