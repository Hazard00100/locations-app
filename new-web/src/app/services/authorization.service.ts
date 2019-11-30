import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Globals } from '../../globals';
import { User } from '../models/user';
const helper = new JwtHelperService();

@Injectable()
export class AuthorizationService {
  subject: Subject<boolean> = new Subject<boolean>();
  userData: object;

  constructor(private http: HttpClient, private globals: Globals) {
    this.subject.next(this.loggedIn());
  }

  login(user: User) {
    return this.http.post(this.globals.API_URL + 'sign-in', user)/*
      .map(res => {
        return res.json();
      })*/;
  }

  register(user: User) {
    return this.http.post(this.globals.API_URL + 'sign-up', user)/*
      .map(res => {
        return res.json();
      })*/;
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
    const token = localStorage.getItem('token')
    return token && true || false;
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
