var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
var DirectionsPage = /** @class */ (function () {
    function DirectionsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.markers = [];
    }
    DirectionsPage.prototype.ngOnInit = function () {
        this.workshopLocation = this.navParams.data;
        this.initMap();
    };
    DirectionsPage.prototype.initMap = function () {
        var _this = this;
        navigator.geolocation.getCurrentPosition(function (location) {
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, {
                center: { lat: location.coords.latitude, lng: location.coords.longitude },
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
                end: 'assets/imgs/workshop-icon.png'
            };
            var directionsService = new google.maps.DirectionsService();
            var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            directionsDisplay.setMap(_this.map);
            var request = {
                origin: { lat: location.coords.latitude, lng: location.coords.longitude },
                destination: _this.workshopLocation,
                travelMode: google.maps.TravelMode.DRIVING
            };
            directionsService.route(request, function (results, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(results);
                    var leg = results.routes[0].legs[0];
                    new google.maps.Marker({
                        position: leg.start_position,
                        map: _this.map,
                        icon: icons.start,
                        title: 'You are here'
                    });
                    makeMarker(leg.start_location, icons.start, 'You are here!');
                    makeMarker(position, icon, title);
                    {
                        new google.maps.Marker({
                            position: position,
                            map: _this.map,
                            icon: icon,
                            title: title
                        });
                    }
                }
            });
        });
    };
    __decorate([
        ViewChild('map'),
        __metadata("design:type", ElementRef)
    ], DirectionsPage.prototype, "mapElement", void 0);
    DirectionsPage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-directions',
            templateUrl: 'directions.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], DirectionsPage);
    return DirectionsPage;
}());
export { DirectionsPage };
//# sourceMappingURL=directions.js.map