import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { User } from '../../models/user';
import { TabsPage } from '../tabs/tabs';
import { ProfileService } from '../../services/profile';
import { EditProfilePage } from './edit-profile/edit-profile';
import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {

	// user = {} as User;
	// users: Observable<any>;

	// constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase, 
	// 	private navCtrl: NavController, private alertCtrl: AlertController) {
	// 		this.afAuth.authState.subscribe(auth => {
	// 			console.log('masuk');
	// 			this.users = db.object(`users/${auth.uid}`).valueChanges().map(user => {console.log(user)});
	// 		});
	// 		console.log('tak masuk');
	// }

	// onSubmit() {

	// 	const alert = this.alertCtrl.create({
	// 		message: 'Your profile updated!',
	// 		buttons: ['Ok']
	// 	});

	// 	this.afAuth.authState.subscribe(auth => {
	// 		this.db.object(`users/${auth.uid}`).set(this.user)
	// 		.then(() => {
	// 			alert.present();
	// 			console.log(auth.uid);
	// 			console.log(auth.getIdToken());
	// 			this.navCtrl.push(TabsPage);
	// 		});
	// 	})

		
	// }

	userRef: AngularFireObject<any>;
	user: Observable<any>;

	constructor(private modalCtrl: ModalController, private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
		this.afAuth.authState.take(1).subscribe(auth => {
			this.userRef = this.db.object(`user/${auth.uid}`);
			this.user = this.userRef.valueChanges();
		})
	}

	onEditProfile() {
		let modal = this.modalCtrl.create(EditProfilePage, {cssClass:"myModal"});
		modal.present();
	}
 }
