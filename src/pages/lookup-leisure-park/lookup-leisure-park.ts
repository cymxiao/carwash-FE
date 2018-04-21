import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, NavParams ,Platform} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { IUILeisurePark } from '../../model/leisurePark';
import { IUser } from '../../model/user';
import { BasePage } from '../base/base';

import { AppSettings } from '../../settings/app-settings';
import { RestServiceProvider } from '../../providers/rest-service/rest-service';

import * as moment from 'moment';

import { ENV } from '@app/env';
/**
 * Generated class for the LookupLeisureParkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-lookup-leisure-park',
  templateUrl: 'lookup-leisure-park.html',
})
export class LookupLeisureParkPage extends BasePage {

  sharedLeisureParks : IUILeisurePark[];
  currentUser: IUser;
  inputComId: string;
  canApply: boolean = true ;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private localNotifications: LocalNotifications, public alertCtrl: AlertController,
    public plt: Platform,
    public apiService: RestServiceProvider) {
      super(navCtrl,navParams);
    //  console.log(LeisureParkStatus.pending);
    this.inputComId = navParams.get('comId');
    this.plt.ready().then(x => {
      // console.dir(this.plt);
      // console.log();  //output dom
          // console.log();
      if (!this.plt.is('core')) {
        this.localNotifications.on('click').subscribe(notification => {
          console.log('click');

          let json = JSON.parse(notification.data);

          let alert = alertCtrl.create({
            title: notification.title,
            subTitle: json.mydata
          });
          alert.present();
        });
      }
    });
  }

  ionViewDidLoad() {
    this.currentUser = AppSettings.getCurrentUser(); 
    console.log('ionViewDidLoad LookupLeisureParkPage');
    this.getLeisureParkbyCommunity();
  }

  apply(leiPk) {
    console.log('lpId: ' + leiPk._id);
    const updateBody = {
      status: 'applied',
      applied_UserID: this.currentUser._id
    };
    if (ENV.mode !== 'test') {
      this.apiService.getLeisureParkforApplier(this.currentUser._id).then((lpk: any) => {
        if (lpk && lpk.length > 0) {
          console.dir(lpk);
          lpk.forEach(x => {  
            if (x && x.status && x.status.length>0 && x.status[0] === 'applied') {
              this.canApply = false; 
            }
          })
          if (this.canApply) {
            this.apiService.updateleisurePark(leiPk._id, updateBody).then(lp => {
              if (lp) {
                super.refresh();
              }
            });
          } else {
            this.presentAlert();
          }
        }
      });
    }
  }

  scheduleNotification() {
    this.localNotifications.schedule({
      id: 1,
      title: '注意',
      text: '您的共享车位已被申请',
      data: { mydata: 'My hidden message this is' }
    });
  }  

  getLeisureParkbyCommunity() {
    if(!this.inputComId){
      this.inputComId = this.navParams.get('comId');
    }
    this.apiService.getLeisureParkbyCommunity(this.inputComId, this.currentUser._id).then((lpark: any) => {
      if (lpark && lpark.length>0) {
        this.sharedLeisureParks = lpark;
        this.sharedLeisureParks.forEach(x => {
          x.priceUnitDisplayText = AppSettings.getDisplayText(x.priceUnit, AppSettings.priceUnitDict);
          x.statusDisplayText = AppSettings.getDisplayText( x.status , AppSettings.leisureParkStatusDict); 
          x.avaibleHours = this.getHoursNumber(x.startTime,x.endTime);
        }) 
      }
    });
  }  

  getHoursNumber(startTime,endTime )
  {
    var a = moment(endTime);
    var b = moment() > moment(startTime) ? moment() : moment(startTime); 
    //console.log(a.format() + '|||||||' + b.format());
    return a.diff(b, 'hours'); // 1
  }


  presentAlert() {
    let alert = this.alertCtrl.create({
      title: '不可申请',
      subTitle: '您有状态为已申请未支付的订单，请先支付或取消该订单',
      buttons: [  {
        text: '关闭',
        role: 'cancel',
        handler: () => {
          //console.log('Cancel clicked');
        }
      }]
    });
    alert.present();
  }
  
}
