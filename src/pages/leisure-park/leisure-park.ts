import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { ILeisurePark , IUILeisurePark } from '../../model/leisurePark';
import { IUser } from '../../model/user';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

import { ICommunity } from '../../model/community';
import { ICarport } from '../../model/carport';
import { SelectCommunityModalPage } from '../select-community-modal/select-community-modal';
import { AppSettings, LeisureParkStatus } from '../../settings/app-settings';
/**
 * Generated class for the LeisureParkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leisure-park',
  templateUrl: 'leisure-park.html',
})
export class LeisureParkPage {


  leisurePark: ILeisurePark;
  currentUser: IUser;
  currentCommunity: ICommunity;
  currentCarport: ICarport;
  showAddContent: boolean;
  myLeisureParks : IUILeisurePark[];

  constructor(public navCtrl: NavController,
    public params: NavParams,
    public service: RestServiceProvider,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
    this.leisurePark = { 
      id: '', 
      startTime: null,
      endTime: null,
      status: '',
      carport_ID: '',
      community_ID: '',
      applied_UserID: '',
      shared_UserID: '',
      price: '',
      timestamp: null,
      priceUnit: ''
    }

    this.currentCommunity = {
      _id: '',
      id: '',
      __v: '',
      name: '',
      position: '',
      mapid: '',
      city_ID: '',
      address: ''
    }
    this.currentCarport = {
      _id: '',
      id: '',
      __v: '',
      parkingNumber: '',
      type: '',
      route: '',
      owner_user_ID: ''
    }

    //console.log('get param : ' + this.params.get('reload'));
  }

  ionViewDidLoad() { 
    this.currentUser = AppSettings.getCurrentUser(); 
    if (this.currentUser && !this.currentUser.community_ID) {  
      this.presentModal();
    } else {  
      if (!AppSettings.getCurrentCarport()) {
        this.service.getCarportListByOwnerId(this.currentUser._id).then((carp: any) => {
          //console.dir(carp);
          //Amin: Todo: temp solution 
          if (carp) {
            let carport = null;
            carp.forEach(element => {
              carport = element;
            });
            this.currentCarport = carport;
            localStorage.setItem('carport', JSON.stringify(carport));
          }
        });
      } else {
        this.currentCarport = AppSettings.getCurrentCarport();
      } 
    }
    this.getLeisureParkforOwner();
  }

    // ionViewWillEnter()
    // {
    //   //console.log('get param : ' + this.params.get('reload'));
    //   //this.navCtrl. refresh();
    // }

  presentModal() {
    const selectcommodal = this.modalCtrl.create(SelectCommunityModalPage);
    selectcommodal.onDidDismiss(data => {
      console.log(data);
      this.refresh();
    });
    selectcommodal.present();
  }

  addButtonClick()
  {
    this.showAddContent = true;
  }

  saveLeisurePark() {
    this.leisurePark.shared_UserID = this.currentUser._id;
    this.leisurePark.carport_ID = this.currentCarport._id;
    this.leisurePark.community_ID = this.currentUser.community_ID._id;
    if(!this.leisurePark.community_ID){
      console.log('saveLeisurePark' + 'delete empty community_ID');
      delete this.leisurePark.community_ID;
    }
    delete this.leisurePark.applied_UserID;
    //the timestamp should be delete, otherwise it would save null to db.
    delete this.leisurePark.timestamp;
    //delete this.leisurePark._id;
    delete this.leisurePark.status;
    this.service.addLeisurePark(this.leisurePark).then((lp: any) => {
      if (lp) {
        //this.showAlert();
        this.showAddContent = false;
        //Todo: how to refresh current page.
        //this.navCtrl.push(LeisureParkPage);
        this.refresh();
      }
    });
  }


  getLeisureParkforOwner() {
    this.service.getLeisureParkforOwner(this.currentUser._id).then((lpark: any) => {
      if (lpark) {
        this.myLeisureParks = lpark;
        this.myLeisureParks.forEach(x => {
          //x.startTime = new Date(x.startTime.toLocaleString("MM-DD-YYYY HH:mm"));
          //status is an array
          if (x.status && x.status.length === 1) {
            if (x.status[0] === 'active') {
              x.statusDisplayText = '可申请';
            } else if (x.status[0] === 'pending') {
              x.statusDisplayText = '待审核';
            } else if (x.status[0] === 'applied') {
              x.statusDisplayText = '已申请';
            } else if (x.status[0] === 'paid') {
              x.statusDisplayText = '已支付';
            } else {
              x.statusDisplayText = '已失效';
            }
          }
        }) 
      }
    });
  }

  // showAlert() {
  //   let alert = this.alertCtrl.create({
  //     title: '发布成功!',
  //     subTitle: '你已经成功发布共享车位',
  //     buttons: ['确定']
  //   });
  //   alert.present();
  // }

  refresh(){
    //location.reload();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

}
