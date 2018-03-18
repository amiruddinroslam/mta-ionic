var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the VehiclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VehiclePage = /** @class */ (function () {
    function VehiclePage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
    }
    VehiclePage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad VehiclePage');
    };
    VehiclePage = __decorate([
        IonicPage(),
        Component({
            selector: 'page-vehicle',
            templateUrl: 'vehicle.html',
        }),
        __metadata("design:paramtypes", [NavController, NavParams])
    ], VehiclePage);
    return VehiclePage;
}());
export { VehiclePage };
//# sourceMappingURL=vehicle.js.map