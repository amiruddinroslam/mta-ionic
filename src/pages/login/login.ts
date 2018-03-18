import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { TabsPage } from '../tabs/tabs';
import { RegisterPage } from '../register/register';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

	constructor(private navCtrl: NavController, private afAuth: AngularFireAuth) {

	}

	onLogin(form: NgForm) {
		this.afAuth.auth.signInWithEmailAndPassword(form.value.email, form.value.password)
		.catch(error => {
			console.log(error);
		});

		this.afAuth.auth.onAuthStateChanged(user => {
			if(user) {
				
				console.log(user.getIdToken());
				this.navCtrl.setRoot(TabsPage);
			}
		})
		
	}

	onRegister() {
		this.navCtrl.push(RegisterPage);
	}
}
