import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

import { TabsPage } from '../tabs/tabs';

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
	totalDistance = 0;
	totalDuration = 0;
	pos = {lat: null, lng: null};
	ref = firebase.database().ref('geolocations/');

	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, 
		private afAuth: AngularFireAuth, private db: AngularFireDatabase) {
			this.geoPosLat = this.navParams.get('geoPosLat');
			this.geoPosLng = this.navParams.get('geoPosLng');
			this.workshopLat = this.navParams.get('workshopLat');
			this.workshopLng = this.navParams.get('workshopLng');
			console.log(this.geoPosLat, this.geoPosLng);
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
					
					this.totalDistance += leg[i].distance.text;
					this.totalDuration += leg[i].duration.text;
				}
				console.log(this.totalDuration);
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
					value: 'battery'
				},
				{
					type: 'radio',
					label: 'Engine',
					value: 'engine'
				},
				{
					type: 'radio',
					label: 'Flat Tyre',
					value: 'tyre'
				},
				{
					type: 'radio',
					label: 'Out of Fuel',
					value: 'fuel'
				},
			],
			buttons: [
				{
					text: 'Cancel'

				},
				{
					text: 'Ok',
					handler: (data: string) => {
						this.afAuth.authState.subscribe(auth => {
							this.db.list(`towRequest/${auth.uid}`).push({
								latitude: this.pos.lat,
								longitude: this.pos.lng,
								problem: data,
								user: auth.uid,
								pickup_flag: 0
							})
						})
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
