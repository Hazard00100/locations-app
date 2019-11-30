import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { tokenNotExpired } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Globals } from '../../globals';
import { User } from '../models/user';

@Injectable()
export class AuthorizationService {
  subject: Subject<boolean> = new Subject<boolean>();
  userData: object;

  constructor(private http: Http, private globals: Globals) {
    this.subject.next(this.loggedIn());
  }

  login(user: User) {
    return this.http.post(this.globals.API_URL + 'sign-in', user)
      .map(res => {
        return res.json();
      });
  }

  register(user: User) {
    return this.http.post(this.globals.API_URL + 'sign-up', user)
      .map(res => {
        return res.json();
      });
  }

  setToken(token: string, admin: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('admin', admin);
    this.subject.next(this.loggedIn());
  }

  getToken() {
    return localStorage.getItem('token');
  }

  loggedIn() {
    return tokenNotExpired();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    this.subject.next(this.loggedIn());
  }

  getUserData() {
    return this.userData;
  }

  setUserData(data: object) {
    console.log(data);
    this.userData = data;
  }

  getRole() {
    return localStorage.getItem('admin') === 'true' ? true : false;
  }

  getUserLoggedIn(): Observable<boolean> {
    return this.subject.asObservable();
  }
}
