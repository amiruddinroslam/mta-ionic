import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-vehicle',
  templateUrl: 'vehicle.html',
})
export class VehiclePage {

  towCompanyRef: AngularFireList<any>;
  towCompany: Observable<any[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private db: AngularFireDatabase, private modalCtrl: ModalController) {
    this.towCompanyRef = this.db.list('user', ref => ref.orderByChild('role').equalTo(2));
    this.towCompany = this.towCompanyRef.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  detail(key) {
    this.modalCtrl.create(VehicleDetailsPage, {"key": key}, {cssClass: "myModal"}).present();
  }

}

@Component({
  template: `<ion-content padding>
              <ion-list>
                  <ion-item text-wrap>
                      Company: {{ (towCompany | async)?.companyName }}
                  </ion-item>
                  <ion-item text-wrap>
                      Reg. No: {{ (towCompany | async)?.companyNo }}
                  </ion-item>
                  <ion-item text-wrap>
                      Contact No: {{ (towCompany | async)?.companyPhoneNo }}
                  </ion-item>
                  <ion-item text-wrap>
                      Email: {{ (towCompany | async)?.companyEmail }}
                  </ion-item>
                  <ion-item text-wrap>
                      Average Rating: {{ average }}/5
                  </ion-item>
              </ion-list>
              <ion-grid>
                  <ion-row>
                      <ion-col>
                          <button ion-button block color="primary" (click)="onOK()">OK</button>
                      </ion-col>
                  </ion-row>
              </ion-grid>
            </ion-content>`,
})
export class VehicleDetailsPage {

  towCompanyRef: AngularFireObject<any>;
  towCompany: Observable<any>;

  towRequestRef: AngularFireList<any>;
  towRequest: Observable<any[]>;

  uid: string;
  towsArr = [];
  sum = 0;
  average = 0;
  totalRating = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
  private db: AngularFireDatabase) {
    this.uid = this.navParams.get("key");
    this.towCompanyRef = this.db.object('user/'+this.uid);
    this.towCompany = this.towCompanyRef.valueChanges();

    this.towRequestRef = this.db.list('towRequest/', ref => ref.orderByChild('driverId').equalTo(this.uid));
    this.towRequest = this.towRequestRef.valueChanges();
    this.getRating();
  }

  getRating() {
    this.towRequest.subscribe(tows => {
      tows.forEach(tow => {
        this.towsArr.push(tow.rating);
      });
      this.towsArr = this.filter_array(this.towsArr);
      this.sum = this.towsArr.reduce((acc, val) => { return acc + val });
      this.average = (this.sum / this.totalRating);
    });
  }

  filter_array(test_array) {
    let index = -1;
    const arr_length = test_array ? test_array.length : 0;
    let resIndex = -1;
    const result = [];

    while (++index < arr_length) {
        const value = test_array[index];

        if (value) {
            result[++resIndex] = +value;
        }
    }
    this.totalRating = +resIndex + 1;
    return result;
  }

  onOK() {
    this.navCtrl.pop();
  }
}
