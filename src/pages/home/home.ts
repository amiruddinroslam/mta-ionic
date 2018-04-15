import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { NearbyWorkshopPage } from '../nearby-workshop/nearby-workshop';

declare var google: any;
var infoWindow: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit{

@ViewChild('map') mapElement: ElementRef;
	
	map: any;
	autocompleteItems: any;
	autocomplete: any;
	GoogleAutocomplete: any;
	geocoder: any;
	markers = [];
	mapOpt = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
	};
	pos = {};

	isHelpRequested = false;

	constructor(private ngZone: NgZone, private geolocation: Geolocation, private navCtrl: NavController, 
		private loadingCtrl: LoadingController, private toastCtrl: ToastController,) {
		//google autocomplete
		this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
		this.autocomplete = { input: '' };
		this.autocompleteItems = [];

		//geocoder
		this.geocoder = new google.maps.Geocoder;
	}

	ngOnInit() {
	
		this.initMap();
	}

	initMap() {
		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

		navigator.geolocation.getCurrentPosition((location) => {
			loading.dismiss();
			this.pos = {lat: location.coords.latitude, lng: location.coords.longitude};

			this.map = new google.maps.Map(this.mapElement.nativeElement, {
			center: this.pos,
      		zoom: 15,
      		disableDefaultUI: true
			});

			var marker = new google.maps.Marker({
				position: this.pos,
				map: this.map,
				icon: 'assets/imgs/person-icon.png',
				animation: google.maps.Animation.DROP,
				draggable: true
			});

			google.maps.event.addListener(marker, 'dragend', () => {
				this.pos = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
			});

			this.markers.push(marker);
			this.map.setCenter(this.pos);
			infoWindow = new google.maps.InfoWindow();
			var service = new google.maps.places.PlacesService(this.map);
			service.nearbySearch({
				location: this.pos,
				radius: 5000,
				type: ['car_repair']
			}, (results, status) => {
				if(status === google.maps.places.PlacesServiceStatus.OK) {
					var toast;
					for(var i = 0; i < results.length; i++) {
						this.createMarker(results[i]);
						
						toast = this.toastCtrl.create({
							message: results.length+' workshops found within 5 kilometers from your location.',
							duration: 2000
						})
					}
					toast.present();
				}
			}, (error) => {
				console.log(error);
			}, this.mapOpt);
		});
	}

	createMarker(place) {

		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: this.map,
			position: placeLoc,
			icon: 'assets/imgs/wrench-icon.png'
		});

		google.maps.event.addListener(marker, 'click', function() {
				infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
			        'Place ID: ' + place.place_id + '<br>' +
			        place.vicinity + '</div>');
				infoWindow.open(this.map, marker);

		});
		
	}

	/*initGeolocation(){
		//loading
		const loading = this.loadingCtrl.create({
			content: 'Please wait...'
		});

		loading.present();

		this.clearMarkers();
		this.geolocation.getCurrentPosition().then((resp) => {
			loading.dismiss();
			let pos = {
				lat: resp.coords.latitude,
				lng: resp.coords.longitude
			};
			let marker = new google.maps.Marker({
				position: pos,
				map: this.map,
				title: 'I am here!'
			});
			this.markers.push(marker);
			this.map.setCenter(pos);
		}).catch((error) => {
			loading.dismiss();
			console.log('Error getting location', error);
		});
	}*/

	updateSearchResults() {
		if (this.autocomplete.input == '') {
			this.autocompleteItems = [];
			return;
		}
		this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
			(predictions, status) => {
				this.autocompleteItems = [];
				this.ngZone.run(() => {
					predictions.forEach((prediction) => {
						this.autocompleteItems.push(prediction);
					});
				});
  		});
	}

	selectSearchResult(item){
		console.log(item);
		this.clearMarkers();
		this.autocompleteItems = [];

		this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
			console.log(results);
			console.log(results[0]);
			if(status === 'OK' && results[0]){
		        this.pos = {
		            lat: results[0].geometry.location.lat(),
		            lng: results[0].geometry.location.lng()
				};
				console.log(this.pos);
		        let marker = new google.maps.Marker({
		        	position: results[0].geometry.location,
		        	map: this.map
		        });
		        this.markers.push(marker);
				this.map.setCenter(results[0].geometry.location);
	    	}
		})
	}

	clearMarkers(){
		for (var i = 0; i < this.markers.length; i++) {
		  console.log(this.markers[i])
		  this.markers[i].setMap(null);
		}
		this.markers = [];
	}

	onRequest() {
		console.log(this.pos);
		this.isHelpRequested = true;
		this.navCtrl.setRoot(NearbyWorkshopPage, this.pos);
	}

	onCancel() {
		this.isHelpRequested = false;
	}
  	
}

