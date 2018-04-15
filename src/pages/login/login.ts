import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { AuthService } from '../../services/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	user: Observable<any>;
	uid: string;
	roles: any;

	constructor(private navCtrl: NavController, private authService: AuthService, 
		private loadingCtrl: LoadingController, private toastCtrl: ToastController,
		private db: AngularFireDatabase, private afAuth: AngularFireAuth) {

	}

	onLogin(form: NgForm) {

		const loading = this.loadingCtrl.create({
			content: 'Please wait'
		});
		loading.present();

		const toast = this.toastCtrl.create({
			message: 'Wrong email or password. Please try again.',
			duration: 2000
		});
		
		this.authService.login(form.value.email, form.value.password)
		.then(data => {
			// this.afAuth.authState.subscribe(auth => {
			// 	this.user = this.db.object(`user/${auth.uid}`).valueChanges();
			// 	this.user.subscribe(res => {
			// 		if(res.role == 1) {
			// 			loading.dismiss();
			// 			this.navCtrl.setRoot(TabsPage);
			// 		} else {
			// 			loading.dismiss();
			// 			toast.present();
			// 		}
			// 	});
			// });
			
			loading.dismiss();
			this.navCtrl.setRoot(TabsPage);
		})
		.catch(error => {
			loading.dismiss();
			toast.present();
			console.log(error);
		});
	}

	onRegister() {
		this.navCtrl.push(RegisterPage);
	}
}
