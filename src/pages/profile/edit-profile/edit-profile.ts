import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { User } from '../../../models/user';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
//import 'rxjs/add/operator/take';

// import { NgModule }      from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { FormsModule }   from '@angular/forms';

@Component({
    selector: 'page-edit-profile',
    templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

    user = {} as User;
    
    constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, private navCtrl: NavController) {

    }
    
    editProfile() {
        this.afAuth.authState.take(1).subscribe(auth => {
            this.db.object(`user/${auth.uid}`).set(this.user)
            .then(() => console.log('add success'));
            this.db.object(`user/${auth.uid}`).update({role: 1})
            .then(() => console.log('add role success'));
        });
        this.navCtrl.pop();
    }

    cancel() {
        this.navCtrl.pop();
    }
}