import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';
import { AuthService } from '../../services/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	constructor(private navCtrl: NavController, private authService: AuthService, 
		private loadingCtrl: LoadingController, private toastCtrl: ToastController,
		private db: AngularFireDatabase) {

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
