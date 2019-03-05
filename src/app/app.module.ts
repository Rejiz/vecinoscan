import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { IntroPage } from '../pages/intro/intro';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { QRScanner } from '@ionic-native/qr-scanner';
import { CommonProvider } from '../providers/common/common';
import { LinkyModule } from 'angular-linky';
import { FeedUpdatesProvider } from '../providers/feed-updates/feed-updates';
import { Network } from '@ionic-native/network';
import { NetworkstatusProvider } from '../providers/networkstatus/networkstatus';
import { DatabaseProvider } from '../providers/database/database';
import { IonicStorageModule } from '@ionic/storage';
import { HTTP } from '@ionic-native/http';
import { HeaderColor } from '@ionic-native/header-color';
import { Badge } from '@ionic-native/badge';
import { IonicPageModule } from 'ionic-angular';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    IntroPage,
    TabsPage
  ],
  imports: [
    BrowserModule, 
    LinkyModule, 
    HttpModule,
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    FormsModule,
    IonicStorageModule.forRoot({
      name: '__mydb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    IonicPageModule.forChild(HomePage),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    IntroPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    AuthServiceProvider,
    QRScanner,
    CommonProvider,
    Network,
    HTTP,
    HeaderColor,
    Badge,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedUpdatesProvider,
    NetworkstatusProvider,
    DatabaseProvider
  ]
})
export class AppModule {}
