import { TabsPage } from './../tabs/tabs';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  key: string;
  towReqRef: AngularFireObject<any>;
  towReq: Observable<any>;

  totalDistance: number;
  totalPrice: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase,
              private toastCtrl: ToastController, private alertCtrl: AlertController) {
    this.key = this.navParams.get("key");
    this.towReqRef = this.db.object('towRequest/'+this.key);
    this.towReq = this.towReqRef.valueChanges();
    this.getTotalDuration();
  }

  getTotalDuration() {
    this.towReq.subscribe(res => {
      this.totalDistance = (+res.distance/1000);
      this.totalPrice = +this.totalDistance * 17;
      this.totalPrice = +this.totalPrice.toFixed(2);
      console.log(this.totalPrice);

      this.towReqRef.update({"totalPayment": this.totalPrice});
    })
  }

  rate() {
    const toast = this.toastCtrl.create({
      message: 'Thank you for using Mobile Tow Assist.',
      duration: 3000
    });

    const alertRating = this.alertCtrl.create({
      title: 'Rating',
      subTitle: 'Please give your rating on the towing service',
      inputs: [
        {
          type: 'radio',
          label: '1',
          value: '1'
        },
        {
          type: 'radio',
          label: '2',
          value: '2'
        },
        {
          type: 'radio',
          label: '3',
          value: '3'
        },
        {
          type: 'radio',
          label: '4',
          value: '4'
        },
        {
          type: 'radio',
          label: '5',
          value: '5'
        }
      ],
      buttons: [
        {
          text: 'Rate',
          handler: (rating) => {
            this.towReqRef.update({"rating": rating});
            toast.present();
            this.navCtrl.setRoot(TabsPage);
          }
        }
      ]
    });

    alertRating.present();

    setTimeout(() => {
      this.navCtrl.setRoot(TabsPage);
    }, 60000);
  }

}
