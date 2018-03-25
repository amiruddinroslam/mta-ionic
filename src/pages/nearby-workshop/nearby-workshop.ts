import { Component, NgZone, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { DirectionsPage } from '../directions/directions';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-nearby-workshop',
  templateUrl: 'nearby-workshop.html',
})
export class NearbyWorkshopPage implements OnInit{

  nearbyItems: any = new Array<any>();
  GooglePlaces: any;
  autocomplete: any;
  GoogleAutocomplete: any;
  autocompleteItems = [];
  geocoder: any;
  pos: any;
  geoPosLat: any;
  geoPosLng: any;
  workshopLat: any;
  workshopLng: any;

  constructor(private ngZone: NgZone, private loadingCtrl: LoadingController, private alertCtrl: AlertController, 
    private geolocation: Geolocation, private navCtrl: NavController, private navParams: NavParams) {
  	
  	this.geocoder = new google.maps.Geocoder;
  	let elem = document.createElement('div');
  	this.GooglePlaces = new google.maps.places.PlacesService(elem);
  	this.GoogleAutocomplete = new google.maps.places.AutocompleteService();

    this.autocomplete = {
      input: ''
    };

  }

  ngOnInit() {
    this.geoPosLat = this.navParams.get('lat');
    this.geoPosLng = this.navParams.get('lng');
    console.log(this.geoPosLat+' and '+this.geoPosLng);
    if(this.geoPosLat && this.geoPosLng) {
       this.initGeolocation(this.geoPosLat, this.geoPosLng);
    }
   
  }

  ionViewDidLoad() {
    const alert = this.alertCtrl.create({
      message: 'You can also search nearby workshop based on place in the search box.',
      buttons: ['Ok']
    });

    alert.present();
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.ngZone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }

  selectSearchResult(item){
  	//loading
  	const loading = this.loadingCtrl.create({
  		content: 'Please wait...'
  	});

  	loading.present();

  	this.autocompleteItems = [];
  	this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
  		if(status === 'OK' && results[0]){
        this.autocompleteItems = [];
        //console.log(results[0].geometry.location.lat(), results[0].geometry.location.lng())
  			this.GooglePlaces.nearbySearch({
  				location: results[0].geometry.location,
  				radius: '5000',
          types: ['car_repair'], //check other types here https://developers.google.com/places/web-service/supported_types
          key: 'AIzaSyDf7_QOSGFscNNjgt6ArugYZ2tt891KtO0'
        }, (near_places) => {
          this.ngZone.run(() => {
            this.nearbyItems = [];
            for (var i = 0; i < near_places.length; i++) {
              this.nearbyItems.push(near_places[i]);
            }
            loading.dismiss();
          });
        })
  		}
  	})
  }

  initGeolocation(geoPosLat, geoPosLng){
    console.log(geoPosLat, geoPosLng)
    //loading
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    /*this.geolocation.getCurrentPosition().then((resp) => {
      this.pos = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };*/

      this.GooglePlaces.nearbySearch({
      location: {lat: geoPosLat, lng: geoPosLng},
      radius: '5000',
          types: ['car_repair'], //check other types here https://developers.google.com/places/web-service/supported_types
          key: 'AIzaSyDf7_QOSGFscNNjgt6ArugYZ2tt891KtO0'
        }, (near_places) => {
          this.ngZone.run(() => {
            this.nearbyItems = [];
            for (var i = 0; i < near_places.length; i++) {
              this.nearbyItems.push(near_places[i]);
            }
            loading.dismiss();
          });
     })
      
    /*}).catch((error) => {
      loading.dismiss();
      console.log('Error getting location', error);
    });*/
  }

  onSelectWorkshop(workshopLocation) {
    this.workshopLat = workshopLocation.lat();
    this.workshopLng = workshopLocation.lng();
    console.log(this.geoPosLat, this.geoPosLng);
    this.navCtrl.setRoot(DirectionsPage,{geoPosLat: this.geoPosLat, geoPosLng: this.geoPosLng, workshopLat: this.workshopLat, workshopLng: this.workshopLng});
  }
}
