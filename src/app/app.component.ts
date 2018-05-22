import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, MenuController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { timer } from 'rxjs/observable/timer';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { VehiclePage } from '../pages/vehicle/vehicle';
import { LoginPage } from '../pages/login/login';

//firebase
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
// import { tap } from 'rxjs/operators';
// import { Subject } from 'rxjs/Subject';

//import { FcmProvider } from './../providers/fcm/fcm';
import { Observable } from 'rxjs/Observable';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild('nav') nav; NavController;

  userRef: AngularFireObject<any>;
  user: Observable<any>;

  rootPage:any = LoginPage;
  homePage = HomePage;
  profilePage = ProfilePage;
  vehiclePage = VehiclePage;
  tabsPage = TabsPage;

  showSplash = true;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private menuCtrl: MenuController, private afAuth: AngularFireAuth,
  toastCtrl: ToastController, private db: AngularFireDatabase, private zone: NgZone/*, fcm: FcmProvider*/) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      });
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

    /*var unsubscribe = */
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
       this.userRef = this.db.object('user/'+user.uid);
       this.user = this.userRef.valueChanges();
      } 
    });
    //unsubscribe();

      
  }

  onLoad(page: any) {
    this.nav.setRoot(page);
    this.menuCtrl.close();
  }

  onLogout() {
    this.nav.setRoot(LoginPage);
    //this.afAuth.auth.signOut();
    firebase.auth().signOut();
  }
}
