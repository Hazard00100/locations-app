import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';


import { AuthorizationService } from './authorization.service';
import { Globals } from '../../globals';

@Injectable()
export class LocationService {
  constructor(
    private authorizationService: AuthorizationService,
    private http: Http,
    private authHttp: AuthHttp,
    private globals: Globals,
  ) { }

  sendCurrentLatLng(data: object) {
    console.log('sendCurrentLatLng  ==== ', data);
    const url = this.globals.API_URL + 'handle-with-lat-lng';
    return this.authHttp.put(url, data).map(res => { return res.json() });
  }

  getMyLocationData() {
    const url = this.globals.API_URL + 'data-lat-lng';
    return this.authHttp.get(url).map(res => { return res.json() });
  }

  getPlace() {
    const url = this.globals.API_URL + 'list-place';
    return this.authHttp.get(url).map(res => res.json());
  }
}
