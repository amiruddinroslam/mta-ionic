import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import * as firebase from 'firebase/app';
import { Device } from '@ionic-native/device';

declare var google: any;

@IonicPage()
@Component({
    selector: 'page-fetch-tow',
    templateUrl: 'fetch-tow.html',
})
export class FetchTowPage implements OnInit{

  @ViewChild('map') mapElement: ElementRef;

  towReqRef: AngularFireObject<any>;
  towReq: Observable<any>;

  towObjRef: AngularFireObject<any>;
	towObj: Observable<any>;

	userObjRef: AngularFireObject<any>;
	userObj: Observable<any>;
  key: string;
  driverId: string;
  userId: string;
  userLat: any;
  userLng: any;
  status: string;

  map: any;
  markers = [];
  userMarker: any;
  mapOpt = {
    enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 3000
  };

  ref = firebase.database().ref('geolocations/');

    constructor(public navParams: NavParams, private db: AngularFireDatabase, private loadingCtrl: LoadingController, 
                private geolocation: Geolocation, private device: Device, private afAuth: AngularFireAuth, private zone: NgZone,
              private alertCtrl: AlertController) {
      this.key = this.navParams.get('key');
      this.userId = this.navParams.get('userId');
      this.userLat = this.navParams.get('originLat');
      this.userLng = this.navParams.get('originLng');
      console.log(this.userLat, this.userLng);

      this.towReqRef = this.db.object('towRequest/'+this.key);
      this.towReq = this.towReqRef.valueChanges();

    }

    ngOnInit() {
      const loading = this.loadingCtrl.create({
        content: 'Please wait for tow operator to pick up your request.<br>TOW COMPANY'
      });
      
      const alertArrivedUser = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'confirm that tow truck arrived at your location?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.towReqRef.update({"status": "tow_assigned"});
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.towReqRef.update({"status": "arrived_at_user"});
            }
          }
        ]
      });

      const alertPickup = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'confirm that your vehicle on towing?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.towReqRef.update({"status": "arrived_at_user"});
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.towReqRef.update({"status": "picked_up"});
            }
          }
        ]
      });

      const alertWorkshop = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'confirm that your vehicle arrived at workshop?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.towReqRef.update({"status": "picked_up"});
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.towReqRef.update({"status": "arrive_at_workshop"});
            }
          }
        ]
      });

      loading.present();
      this.towReq.subscribe(action => {
        console.log(action.pickup_flag);
        if(action.pickup_flag == 1) {
          loading.dismiss();

          this.initMap();

          this.zone.run(() => {
            this.driverId = action.driverId;
          });

          this.towObjRef = this.db.object('geolocations/'+this.driverId);
          this.towObj = this.towObjRef.valueChanges();
          this.getTowLocation();
        };

        if(action.status == "tow_assigned") {
          this.status = "Tow truck is on the way";
        } else if(action.status == "arrived_at_user") {
          alertArrivedUser.present();
          this.status = "Tow truck arrived at your location";
        } else if(action.status == "picked_up") {
          alertPickup.present();

          this.status = "Towing your vehicle to workshop";
        } else if(action.status == "arrived_at_workshop") {
          alertWorkshop.present();
          this.status = "Arrived at workshop";
        }
        
      });
    }

    getTowLocation() {
      this.towObj.subscribe(response => {
        console.log(response);
        this.deleteMarkers();
        let image = 'assets/imgs/truck-icon.png';
        let updatelocation = new google.maps.LatLng(response.latitude, response.longitude);
        this.addMarker(updatelocation,image);
        this.setMapOnAll(this.map);
      });
    }

    initMap() {

      // const loading = this.loadingCtrl.create({
      //   content: 'Please wait...'
      // });
  
      // loading.present();

      let userLocation = new google.maps.LatLng(this.userLat, this.userLng);
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
				zoom: 15,
				center: userLocation,
				disableDefaultUI: true
			});
      
      let image = 'assets/imgs/person-icon.png';
			this.userMarker = new google.maps.Marker({
				position: userLocation,
				map: this.map,
				icon: image
			});
      this.userMarker.setMap(this.map);

    }

    initMapError(error) {
      console.log(error);
      this.initMap();
    }

    private addMarker(location, image) {
      let marker = new google.maps.Marker({
        position: location,
        map: this.map,
        icon: image
      });
      this.markers.push(marker);
      console.log(this.markers);
    }
  
    private setMapOnAll(map) {
      this.markers.forEach(marker => {
        marker.setMap(map);
      })
    }
  
    private clearMarkers() {
      console.log('clear markers');
      this.setMapOnAll(null);
    }
  
    private deleteMarkers() {
      this.clearMarkers();
      this.markers = [];
    }

    completeRequest() {
      const alertRating = this.alertCtrl.create({
        title: 'Rating',
        subTitle: 'Please give your rating on the towing service',
        cssClass: 'alertstar',
        enableBackdropDismiss:false,
        buttons: [
            { text: '1', handler: data => { console.log(data) }},
            { text: '2', handler: data => { console.log(data) }},
            { text: '3', handler: data => { console.log(data) }},
            { text: '4', handler: data => { console.log(data) }},
            { text: '5', handler: data => { console.log(data) }}
        ]
      });

      const alertComplete = this.alertCtrl.create({
        title: 'Confirmation',
        message: 'Confirm that the towing request is completed?',
        buttons: [
          {
            text: 'No',
            role: 'cancel'
          },
          {
            text: 'Yes',
            handler: () => {
              alertRating.present();
              this.towReqRef.update({"status": "completed"});
            }
          }
      ]
      });
      alertComplete.present();
      
    }

}
