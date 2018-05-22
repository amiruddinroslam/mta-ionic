import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { AuthService } from '../../services/auth';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  animations: [
 
    //For the logo
    trigger('flyInBottomSlow', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0'}),
        animate('2000ms ease-in-out')
      ])
    ]),
 
    //For the background detail
    trigger('flyInBottomFast', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        style({transform: 'translate3d(0,2000px,0)'}),
        animate('1000ms ease-in-out')
      ])
    ]),
 
    //For the login form
    trigger('bounceInBottom', [
      state('in', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('void => *', [
        animate('2000ms 200ms ease-in', keyframes([
          style({transform: 'translate3d(0,2000px,0)', offset: 0}),
          style({transform: 'translate3d(0,-20px,0)', offset: 0.9}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ]),
 
    //For login button
    trigger('fadeIn', [
      state('in', style({
        opacity: 1
      })),
      transition('void => *', [
        style({opacity: 0}),
        animate('1000ms 2000ms ease-in')
      ])
    ])
  ]
})
export class RegisterPage {
	
	logoState: any = "in";
	cloudState: any = "in";
	loginState: any = "in";
	formState: any = "in";

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
