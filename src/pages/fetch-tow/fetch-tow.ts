import { Observable } from 'rxjs/Observable';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
    selector: 'page-fetch-tow',
    templateUrl: 'fetch-tow.html',
})
export class FetchTowPage implements OnInit{

  @ViewChild('map') mapElement: ElementRef;

  towReqRef: AngularFireObject<any>;
  towReq: Observable<any>;
  key: string;

    constructor(public navParams: NavParams, private db: AngularFireDatabase, private loadingCtrl: LoadingController) {
      this.key = this.navParams.get('key');
      this.towReqRef = this.db.object('towRequest/'+this.key);
      this.towReq = this.towReqRef.valueChanges();
    }

    ngOnInit() {
      const loading = this.loadingCtrl.create({
        content: 'Please wait for tow operator to pick up your request.'
      });
      loading.present()
      this.towReq.subscribe(action => {
        console.log(action.pickup_flag);
        if(action.pickup_flag == 1) {
          loading.dismiss();
        }
      })
      
    }

}
