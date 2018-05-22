import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { TabsPage } from '../tabs/tabs';
import { Observable } from 'rxjs/Observable';
import { FetchTowPage } from '../fetch-tow/fetch-tow';

declare var google: any;

@IonicPage()
@Component({
selector: 'page-directions',
templateUrl: 'directions.html',
})
export class DirectionsPage {
@ViewChild('map') mapElement: ElementRef;

	geoPosLat;
	geoPosLng;
	workshopLat: any;
  	workshopLng: any;
	map: any;
	markers = [];
	totalDistance: string;
	totalDuration: string;
	totalDistanceInMeter = 0;
	pos = {lat: null, lng: null};
	ref = firebase.database().ref('geolocations/');
	currentDate: Date;
	key: any;

	towReq: Observable<any>;
	towReqRef: AngularFireList<any>;

	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, 
		private afAuth: AngularFireAuth, private db: AngularFireDatabase, private loadingCtrl: LoadingController, private afs: AngularFirestore) {
			this.geoPosLat = this.navParams.get('geoPosLat');
			this.geoPosLng = this.navParams.get('geoPosLng');
			this.workshopLat = this.navParams.get('workshopLat');
			this.workshopLng = this.navParams.get('workshopLng');
			console.log('geoPosLat: '+this.geoPosLat, 'geoposLng: '+this.geoPosLng, 'workshopLat: '+this.workshopLat, 'workshopLng: '+this.workshopLng);
			setTimeout(() => {
				this.initMap();
			}, 1000);

	}

	initMap() {
		this.map = new google.maps.Map(this.mapElement.nativeElement, {
		center: {lat: this.geoPosLat, lng: this.geoPosLng},
		zoom: 15,
		disableDefaultUI: true
		});

		/*let marker = new google.maps.Marker({
			position: {lat: location.coords.latitude, lng: location.coords.longitude},
			map: this.map,
			icon: 'assets/imgs/person-icon.png',
			title: 'You are here'
		});*/

		var icons = {
			start: 'assets/imgs/person-icon.png',
			end: 'assets/imgs/wrench-icon.png'
		};

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer(/*{ suppressMarkers: true }*/);

		directionsDisplay.setMap(this.map);

		var request = {
			origin: {lat: this.geoPosLat, lng: this.geoPosLng},
			destination: {lat: this.workshopLat, lng: this.workshopLng},
			travelMode: google.maps.TravelMode.DRIVING
		}

		directionsService.route(request, (results, status) => {
			if(status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(results);
				var leg = results.routes[0].legs;
				
				for (var i=0; i<leg.length; ++i) {
					
					this.totalDistance = leg[i].distance.text;
					this.totalDuration = leg[i].duration.text;
					this.totalDistanceInMeter += leg[i].distance.value;
				}
				console.log(this.totalDuration);
				console.log(this.totalDistance);
				/*let markerStart = new google.maps.Marker({
					map: this.map,
					position: leg.start_position,
					icon: icons.start
				});
				markerStart.setMap(this.map);

				let markerEnd = new google.maps.Marker({
					map: this.map,
					position: leg.end_position,
					icon: icons.end
				});
				markerEnd.setMap(this.map);*/

			}
		});
	}

	onFindTowTruck() {
		var alert = this.alertCtrl.create({
			title: 'Problem',
			inputs: [
				{
					type: 'radio',
					label: 'Battery',
					value: 'Battery'
				},
				{
					type: 'radio',
					label: 'Engine',
					value: 'Engine'
				},
				{
					type: 'radio',
					label: 'Flat Tyre',
					value: 'Flat Tyre'
				},
				{
					type: 'radio',
					label: 'Out of Fuel',
					value: 'Out of Fuel'
				},
				{
					type: 'radio',
					label: 'Others',
					value: 'Others'
				},
			],
			buttons: [
				{
					text: 'Cancel'

				},
				{
					text: 'Ok',
					handler: (data: string) => {
						this.currentDate = new Date();
						var timeDate = this.currentDate.getHours() + ":"  
				                + this.currentDate.getMinutes() + " "
								+ this.currentDate.getDate() + "/"
				                + (this.currentDate.getMonth()+1)  + "/" 
								+ this.currentDate.getFullYear()
						
						const loading = this.loadingCtrl.create({
							content: 'Please Wait...'
						});
						loading.present();
						
						this.afAuth.authState.subscribe(auth => {

							const docData = {
						      pickup_flag: 0,
						      userId: auth.uid
						    }

							const towRequest = this.afs.collection('towRequest');
							towRequest.doc(auth.uid).set(docData);

							console.log('geoPosLat: '+this.geoPosLat, 'geoposLng: '+this.geoPosLng, 'workshopLat: '+this.workshopLat, 'workshopLng: '+this.workshopLng);
							this.db.list('/towRequest').push({
								userId: auth.uid,
								originLat: this.geoPosLat,
								originLng: this.geoPosLng,
								destLat: this.workshopLat,
								destLng: this.workshopLng,
								problem: data,
								timeDate: timeDate,
								distance: this.totalDistanceInMeter,
								pickup_flag: 0,
								status: 'requested'
							})
							.then(item => {
								loading.dismiss();
								this.key = item.key;
								this.navCtrl.setRoot(FetchTowPage, {'key': this.key, 'userId': auth.uid, 'originLat': this.geoPosLat, 'originLng': this.geoPosLng});
							})
						});
					}
				}
			]
		});
		alert.present();
	}

	onCancelTowTruck() {
		this.navCtrl.push(TabsPage);
	}
}
