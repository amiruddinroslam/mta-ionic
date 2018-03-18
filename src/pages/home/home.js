var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { LoadingController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
var infoWindow;
var HomePage = /** @class */ (function () {
    function HomePage(ngZone, geolocation, loadingCtrl, toastCtrl) {
        this.ngZone = ngZone;
        this.geolocation = geolocation;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.markers = [];
        this.mapOpt = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        this.isHelpRequested = false;
        //google autocomplete
        this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
        this.autocomplete = { input: '' };
        this.autocompleteItems = [];
        //geocoder
        this.geocoder = new google.maps.Geocoder;
    }
    HomePage.prototype.ngOnInit = function () {
        this.initMap();
    };
    HomePage.prototype.initMap = function () {
        var _this = this;
        navigator.geolocation.getCurrentPosition(function (location) {
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, {
                center: { lat: location.coords.latitude, lng: location.coords.longitude },
                zoom: 15,
                disableDefaultUI: true
            });
            var marker = new google.maps.Marker({
                position: { lat: location.coords.latitude, lng: location.coords.longitude },
                map: _this.map,
                icon: 'assets/imgs/person-icon.png',
                title: 'You are here'
            });
            _this.markers.push(marker);
            _this.map.setCenter({ lat: location.coords.latitude, lng: location.coords.longitude });
            infoWindow = new google.maps.InfoWindow();
            var service = new google.maps.places.PlacesService(_this.map);
            service.nearbySearch({
                location: { lat: location.coords.latitude, lng: location.coords.longitude },
                radius: 5000,
                type: ['car_repair']
            }, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    var toast;
                    for (var i = 0; i < results.length; i++) {
                        _this.createMarker(results[i]);
                        toast = _this.toastCtrl.create({
                            message: results.length + ' workshops found within 5 kilometers from your location.',
                            duration: 3000
                        });
                    }
                    toast.present();
                }
            }, function (error) {
                console.log(error);
            }, _this.mapOpt);
        });
    };
    HomePage.prototype.createMarker = function (place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            map: this.map,
            position: placeLoc,
            icon: 'assets/imgs/wrench-icon.png'
        });
        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.vicinity + '</div>');
            infoWindow.open(this.map, marker);
        });
    };
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
    HomePage.prototype.updateSearchResults = function () {
        var _this = this;
        if (this.autocomplete.input == '') {
            this.autocompleteItems = [];
            return;
        }
        this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input }, function (predictions, status) {
            _this.autocompleteItems = [];
            _this.ngZone.run(function () {
                predictions.forEach(function (prediction) {
                    _this.autocompleteItems.push(prediction);
                });
            });
        });
    };
    HomePage.prototype.selectSearchResult = function (item) {
        var _this = this;
        this.clearMarkers();
        this.autocompleteItems = [];
        this.geocoder.geocode({ 'placeId': item.place_id }, function (results, status) {
            if (status === 'OK' && results[0]) {
                // let position = {
                //     lat: results[0].geometry.location.lat,
                //     lng: results[0].geometry.location.lng
                // };
                var marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: _this.map
                });
                _this.markers.push(marker);
                _this.map.setCenter(results[0].geometry.location);
            }
        });
    };
    HomePage.prototype.clearMarkers = function () {
        for (var i = 0; i < this.markers.length; i++) {
            console.log(this.markers[i]);
            this.markers[i].setMap(null);
        }
        this.markers = [];
    };
    HomePage.prototype.onRequest = function () {
        this.isHelpRequested = true;
    };
    HomePage.prototype.onCancel = function () {
        this.isHelpRequested = false;
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], HomePage.prototype, "mapElement", void 0);
    HomePage = __decorate([
        Component({
            selector: 'page-home',
            templateUrl: 'home.html'
        }),
        __metadata("design:paramtypes", [NgZone, Geolocation, LoadingController, ToastController])
    ], HomePage);
    return HomePage;
}());
export { HomePage };
//# sourceMappingURL=home.js.map