import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class FcmProvider {

  constructor(private firebaseNative: Firebase, private afs: AngularFirestore, private platform: Platform, private afAuth: AngularFireAuth) {

  }

  //get permisson from user
  async getToken() {
    let token;

    if(this.platform.is('android')) {
      token = await this.firebaseNative.getToken();
    }

    return this.saveTokenToDatabase(token);
  }

  private getUserId() {
    let uid;
    this.afAuth.authState.subscribe(auth =>{
        uid = auth.uid;
    });

    return uid;
  }

  //save token to db
  private saveTokenToDatabase(token) {
    if(!token) return;

    const devicesRef = this.afs.collection('devices')

    const docData = {
      token,
      userId: this.getUserId()
    }

    return devicesRef.doc(token).set(docData);
  }

  //listen to incoming fcm msg
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen();
  }
}
