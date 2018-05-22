import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { NearbyWorkshopPage } from '../nearby-workshop/nearby-workshop';
//import { FcmProvider } from '../../providers/fcm/fcm';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = NearbyWorkshopPage;

  constructor() {
  }
}
