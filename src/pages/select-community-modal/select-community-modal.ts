import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController } from 'ionic-angular';
import { AutoCompleteServiceProvider } from '../../providers/autocomplete-service/autocomplete-service';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';
import { AppSettings } from '../../settings/app-settings';

/**
 * Generated class for the SelectCommunityModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-community-modal',
  templateUrl: 'select-community-modal.html',
})
export class SelectCommunityModalPage {  
  coms : any ;
  searchQuery: string = '';
  selectedComunityID: string;
  hideList : boolean  ;
  user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public service: RestServiceProvider,
    public autoService: AutoCompleteServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelectCommunityModalPage');
  }

  searchTextChagne(ev: any)
  {
    this.hideList = false;
    this.autoService.getResults(ev.target.value).then( x => {
       this.coms = x;
       this.coms.forEach(element => {
         JSON.stringify(element);
       }); 
    });
    
  }
  
  addItem(item:any){
    this.hideList = true;
    //console.dir(item);
    this.searchQuery =  item.name;
    this.selectedComunityID = item._id;
  } 

  save()
  {
    this.user = AppSettings.getCurrentUser();
    if(this.user._id){
      const udpateContent = {
        community_ID: this.selectedComunityID 
      }
      this.service.updateUser(this.user._id, udpateContent).then(usr => {
        if( usr){
          //update profile
          this.dismiss();
        }
      })
    } 
    
  }

  dismiss() { 
    let data = { 'communityid': this.selectedComunityID };
    this.viewCtrl.dismiss(data);
  }
}
