import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

	constructor(private afAuth: AngularFireAuth, private navCtrl: NavController) {

	}

	onRegister(form: NgForm) {

		this.afAuth.auth.createUserWithEmailAndPassword(form.value.email, form.value.password)
		.then(user => {
			if(user) {
				console.log(user);
			}
		})
		.catch(error => {
			console.log(error);
		});
		/*this.authService.register(form.value.email, form.value.password)
		.then(
			data => console.log(data)
		)
		.catch(error => console.log(error));*/
	}
	goToLogin() {
		this.navCtrl.pop();
	}
}
