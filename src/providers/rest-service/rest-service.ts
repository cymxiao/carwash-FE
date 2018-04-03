import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the RestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RestServiceProvider {

  apiUrl = 'http://localhost:3000';
  constructor(public http: HttpClient) {
    //this.http.post('',null);
    console.log('Hello RestServiceProvider Provider');
  }

  getUsers() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/users').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  addUser(data) {
    return new Promise((resolve, reject) => {

      const headers: any = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
      this.http.post(this.apiUrl + '/users', JSON.stringify(data), headers)
      .subscribe(res => {
          resolve(res);
        }, (err) => {
          reject(err);
        });
    });
  }

  loginUser(data) {
    // const requestBody : any = {
    //   username: data.username,
    //   password: data.password
    // };
    const params = new HttpParams().append("username",data.username).append("password",data.password);
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/userlogin', {params : params } ).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


  getMap() {
    return new Promise(resolve => {
      this.http.get(this.apiUrl + '/maps').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }


}
