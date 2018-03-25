import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { VehiclePage } from '../pages/vehicle/vehicle';
import { NearbyWorkshopPage } from '../pages/nearby-workshop/nearby-workshop';
import { DirectionsPage } from '../pages/directions/directions';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { EditProfilePage } from './../pages/profile/edit-profile/edit-profile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../services/auth';
import { ProfileService } from '../services/profile';

//native
import { Geolocation } from '@ionic-native/geolocation'; 
import { Firebase } from '@ionic-native/firebase';

//firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { credentials } from './config';
//import { FcmProvider } from '../providers/fcm/fcm';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    ProfilePage,
    VehiclePage,
    NearbyWorkshopPage,
    DirectionsPage,
    LoginPage,
    RegisterPage,
    EditProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(credentials.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    ProfilePage,
    VehiclePage,
    NearbyWorkshopPage,
    DirectionsPage,
    LoginPage,
    RegisterPage,
    EditProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //FcmProvider,
    ProfileService,
    Firebase
  ]
})
export class AppModule {}
