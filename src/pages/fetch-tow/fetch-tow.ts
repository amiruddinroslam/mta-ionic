import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
    selector: 'page-fetch-tow',
    templateUrl: 'fetch-tow.html',
})
export class FetchTowPage implements OnInit{

  towReqRef: AngularFireObject<any>;
  towReq: Observable<any>;
  key: string;

    constructor(public navParams: NavParams, private db: AngularFireDatabase, private loadingCtrl: LoadingController) {
      this.key = this.navParams.get('key');
      // this.afAuth.authState.subscribe(auth => {
			// 	//console.log(auth.uid);
      //   // this.towReqRef = this.db.list('towRequest', ref => ref.orderByChild('userId').equalTo(auth.uid));
			// 	this.towReq = this.towReqRef.snapshotChanges(['child_changed']).map(requests => {
      //     return requests.map(c => ({
      //       key: c.payload.key, ...c.payload.val()
			// 		}));
      //   });
			// });
      this.towReqRef = this.db.object('towRequest/'+this.key);
      this.towReq = this.towReqRef.valueChanges();
    }

    ngOnInit() {
      const loading = this.loadingCtrl.create({
        content: 'Please wait for tow operator to pick up your request.'
      });
      loading.present()
      // this.towReq.subscribe(actions => {
      //   console.log(actions);
      //   actions.forEach(action =>  {
      //     console.log(action.pickup_flag);
      //     if(action.pickup_flag == 1) {
      //       loading.dismiss();
      //     }
      //   })
      // });
      this.towReq.subscribe(action => {
        console.log(action.pickup_flag);
        if(action.pickup_flag == 1) {
          loading.dismiss();
        }
      })
      // this.towReq.map(items => {
      //   items.filter(item => item.pickup_flag == 1);
      //   //console.log(filtered);
      // })
      // .subscribe(actions => {
      //     console.log(actions);
      // });
      
    }

}
