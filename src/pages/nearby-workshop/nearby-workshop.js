var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { DirectionsPage } from '../directions/directions';
var NearbyWorkshopPage = /** @class */ (function () {
    function NearbyWorkshopPage(ngZone, loadingCtrl, alertCtrl, geolocation, navCtrl) {
        this.ngZone = ngZone;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.geolocation = geolocation;
        this.navCtrl = navCtrl;
        this.nearbyItems = new Array();
        this.autocompleteItems = [];
        this.geocoder = new google.maps.Geocoder;
        var elem = document.createElement('div');
        this.GooglePlaces = new google.maps.places.PlacesService(elem);
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = {
            input: ''
        };
    }
    NearbyWorkshopPage.prototype.ionViewDidLoad = function () {
        var alert = this.alertCtrl.create({
            message: 'To search for nearby workshop, please enter a location in the search box.',
            buttons: ['Ok']
        });
        alert.present();
    };
    NearbyWorkshopPage.prototype.updateSearchResults = function () {
        var _this = this;
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input }, function (predictions, status) {
            _this.autocompleteItems = [];
            if (predictions) {
                _this.ngZone.run(function () {
                    predictions.forEach(function (prediction) {
                        _this.autocompleteItems.push(prediction);
                    });
                });
            }
        });
    };
    NearbyWorkshopPage.prototype.selectSearchResult = function (item) {
        var _this = this;
        //loading
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.autocompleteItems = [];
        this.geocoder.geocode({ 'placeId': item.place_id }, function (results, status) {
            if (status === 'OK' && results[0]) {
                _this.autocompleteItems = [];
                _this.GooglePlaces.nearbySearch({
                    location: results[0].geometry.location,
                    radius: '5000',
                    types: ['car_repair'],
                    key: 'AIzaSyDf7_QOSGFscNNjgt6ArugYZ2tt891KtO0'
                }, function (near_places) {
                    _this.ngZone.run(function () {
                        _this.nearbyItems = [];
                        for (var i = 0; i < near_places.length; i++) {
                            _this.nearbyItems.push(near_places[i]);
                        }
                        loading.dismiss();
                    });
                });
            }
        });
    };
    NearbyWorkshopPage.prototype.initGeolocation = function () {
        var _this = this;
        //loading
        var loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        loading.present();
        this.geolocation.getCurrentPosition().then(function (resp) {
            _this.pos = {
                lat: resp.coords.latitude,
                lng: resp.coords.longitude
            };
            _this.GooglePlaces.nearbySearch({
                location: _this.pos,
                radius: '5000',
                types: ['car_repair'],
                key: 'AIzaSyDf7_QOSGFscNNjgt6ArugYZ2tt891KtO0'
            }, function (near_places) {
                _this.ngZone.run(function () {
                    _this.nearbyItems = [];
                    for (var i = 0; i < near_places.length; i++) {
                        _this.nearbyItems.push(near_places[i]);
                    }
                    loading.dismiss();
                });
            });
        }).catch(function (error) {
            loading.dismiss();
            console.log('Error getting location', error);
        });
    };
    NearbyWorkshopPage.prototype.onSelectWorkshop = function (workshopLocation) {
        this.navCtrl.push(DirectionsPage, workshopLocation);
    };
    NearbyWorkshopPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-nearby-workshop',
            templateUrl: 'nearby-workshop.html',
        }),
        __metadata("design:paramtypes", [NgZone, LoadingController, AlertController, Geolocation, NavController])
    ], NearbyWorkshopPage);
    return NearbyWorkshopPage;
}());
export { NearbyWorkshopPage };
//# sourceMappingURL=nearby-workshop.js.map