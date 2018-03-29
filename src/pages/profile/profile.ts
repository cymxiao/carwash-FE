import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';
import { COMPOSITION_BUFFER_MODE } from '@angular/forms';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  map: any;
  constructor(public navCtrl: NavController, private restServiceProvider: RestServiceProvider) {
    this.getMap();
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad ProfilePage');
  // }

  getMap() {
    this.restServiceProvider.getMap()
      .then(data => {
        this.map = JSON.stringify(data);
        //this.map = data;
        console.log(this.map);
        //console.log(this.map.address);
      });
  }

}
