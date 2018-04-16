import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { VehiclePage } from '../pages/vehicle/vehicle';
import { LoginPage } from '../pages/login/login';

//firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
// import { tap } from 'rxjs/operators';
// import { Subject } from 'rxjs/Subject';

//import { FcmProvider } from './../providers/fcm/fcm';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('nav') nav; NavController;

  rootPage:any = LoginPage;
  homePage = HomePage;
  profilePage = ProfilePage;
  vehiclePage = VehiclePage;
  tabsPage = TabsPage;


  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController, private afAuth: AngularFireAuth,
  toastCtrl: ToastController/*, fcm: FcmProvider*/) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      // //get fcm token
      // fcm.getToken();

      // fcm.listenToNotifications().pipe(
      //   tap(msg => {
      //     const toast = toastCtrl.create({
      //       message: msg.body,
      //       duration: 3000
      //     });
      //     toast.present();
      //   })
      // ).subscribe()
    });
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.afAuth.auth.signOut();
    this.nav.setRoot(LoginPage);
  }
}
