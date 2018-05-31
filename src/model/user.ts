import { ICommunity } from './community';

export interface IUser  {
    _id: string;
   
    username: string;
    password: string;
    community_ID: ICommunity;
    role: string;
    phoneNo: string;
    address: string; 
    name:string;
    //Amin: limitation . One user can only has one carPlate
    carPlate: string; 
    lastLoginDate:Date;
  }


  // export interface IPopulateUser  {
  //   _id: string;
  //   id: string;
  //   __v: string;
  //   username: Date;
  //   password: Date;
  //   community_ID: ICommunity;
  //   role_ID: string;
  //   phoneNo: string;
  //   address: string; 
    
  // }