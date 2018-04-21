import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';
import { ICarport } from 'model/carport';
import { CarportPage } from '../carport/carport';

import { AutoCompleteServiceProvider } from '../../providers/autocomplete-service/autocomplete-service';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

//import { BasePage } from '../base/base';
import { BasePage } from '../base/base';
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
export class SelectCommunityModalPage  extends BasePage {
  coms: any;
  searchQuery: string = '';
  selectedComunityID: string;
  hideList: boolean;
  user: any;
  parkingNumber: string;
  currentCarportId: string;
  pathdescription: string;
  carportArray: ICarport[];
  newCarport:string;
  currentCarport: ICarport;

  addMode: boolean;
  showCarportList:boolean;
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public service: RestServiceProvider,
    public autoService: AutoCompleteServiceProvider) {
      super(navCtrl,navParams);
      //super();
  }

  ionViewDidLoad() {

    this.initComponents();
    this.getCarportList();
  }

  initComponents() {
    this.user = AppSettings.getCurrentUser();

    if (this.user.community_ID && this.user.community_ID._id) {
      this.searchQuery = this.user.community_ID.name;
    }

    this.currentCarport = AppSettings.getCurrentCarport();
    if(this.currentCarport && this.currentCarport._id){
      this.currentCarportId = this.currentCarport._id;
    }
  }

  searchTextChagne(ev: any) {
    this.hideList = false;
    this.autoService.getResults(ev.target.value).then(x => {
      this.coms = x;
      this.coms.forEach(element => {
        JSON.stringify(element);
      });
    });

  }

  addItem(item: any) {
    this.hideList = true;

    this.searchQuery = item.name;
    this.selectedComunityID = item._id;
  }

  save() {


    if (this.user._id) {
      const udpateContent = {
        community_ID: this.selectedComunityID
      }
      this.service.updateUser(this.user._id, udpateContent).then(usr => {
        if (usr && this.currentCarportId) {
          //add a carport
          const carport = {
            isCurrent: true 
          }
          this.service.updateCarport(this.currentCarportId, carport).then((cp: any) => {
            if (cp) {

              localStorage.setItem('user', JSON.stringify(usr));
              localStorage.setItem('carport', JSON.stringify(cp));
          
            }
          });
        }
      })
    }

  }

  getCarportList() {
    this.service.getCarportListByOwnerId(this.user._id).then((carp: any) => {
  
      if (carp) {
        this.carportArray = carp;
        if(carp.length>0){
          this.showCarportList = true;
        }
      }
    });
  }

  btnAdd() {
    //this.addMode = true;
    this.presentCarportModal();
  }

  btnCancelAdd() {
    this.addMode = false;
  }

  presentCarportModal() {
    let cpModal = this.modalCtrl.create(CarportPage);
    cpModal.onDidDismiss(data => {
      console.log(data);
      this.refresh();
    });
    cpModal.present();
  }
 

  


 
  dismiss(data) {
  
    this.viewCtrl.dismiss(data);
  }

  refresh() {
 
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
 
  goBackHome()
  { 
    super.goBackHome();
  }
}
