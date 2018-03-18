import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

declare var google: any;

@IonicPage()
@Component({
selector: 'page-directions',
templateUrl: 'directions.html',
})
export class DirectionsPage implements OnInit{
@ViewChild('map') mapElement: ElementRef;

	workshopLocation: any;
	map: any;
	markers = [];
	totalDistance = 0;
	totalDuration = 0;

	constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
		
	}

	ngOnInit() {
		this.workshopLocation = this.navParams.data;
		this.initMap();
	}

	initMap() {

		navigator.geolocation.getCurrentPosition((location) => {
			this.map = new google.maps.Map(this.mapElement.nativeElement, {
			center: {lat: location.coords.latitude, lng: location.coords.longitude},
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
				origin: {lat: location.coords.latitude, lng: location.coords.longitude},
				destination: this.workshopLocation,
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
			})
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
						console.log(data);
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
