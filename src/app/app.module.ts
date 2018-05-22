import { PaymentPage } from './../pages/payment/payment';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfilePage } from '../pages/profile/profile';
import { VehiclePage, VehicleDetailsPage } from '../pages/vehicle/vehicle';
import { NearbyWorkshopPage } from '../pages/nearby-workshop/nearby-workshop';
import { DirectionsPage } from '../pages/directions/directions';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { EditProfilePage } from './../pages/profile/edit-profile/edit-profile';
import { FetchTowPage } from './../pages/fetch-tow/fetch-tow';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from './../services/auth';
import { ProfileService } from '../services/profile';

//native
import { Geolocation } from '@ionic-native/geolocation'; 
import { Firebase } from '@ionic-native/firebase';
import { Device } from '@ionic-native/device';

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
    VehicleDetailsPage,
    NearbyWorkshopPage,
    DirectionsPage,
    LoginPage,
    RegisterPage,
    EditProfilePage,
    FetchTowPage,
    PaymentPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(credentials.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    ProfilePage,
    VehiclePage,
    VehicleDetailsPage,
    NearbyWorkshopPage,
    DirectionsPage,
    LoginPage,
    RegisterPage,
    EditProfilePage,
    FetchTowPage,
    PaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AuthService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    //FcmProvider,
    ProfileService,
    Firebase,
    Device
  ]
})
export class AppModule {}
