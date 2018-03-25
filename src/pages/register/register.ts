import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	constructor(private navCtrl: NavController, private authService: AuthService, private toastCtrl: ToastController) {

	}

	onRegister(form: NgForm) {

		const toast = this.toastCtrl.create({
			message: 'User created. Please login to continue.',
			duration: 1500
		});
		this.authService.register(form.value.email, form.value.password)
		.then(user => {
			if(user) {
				toast.present();
				this.navCtrl.setRoot(LoginPage);
			}

		})
		.catch(error => {
			console.log(error);
		});
	}
	goToLogin() {
		this.navCtrl.pop();
	}
}
