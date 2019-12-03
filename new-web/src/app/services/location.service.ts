import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthorizationService } from './authorization.service';
import { Globals } from '../../globals';

@Injectable()
export class LocationService {
  constructor(
    private authorizationService: AuthorizationService,
    private http: HttpClient,
    private globals: Globals,
  ) { }

  sendCurrentLatLng(data: object) {
    console.log('sendCurrentLatLng  ==== ', data);
    const url = this.globals.API_URL + 'handle-with-lat-lng';
    return this.http.put(url, data, {
      headers: {
        authorization: `Bearn ${this.authorizationService.getToken()}`
      }
    })/*.map(res => { return res.json() })*/;
  }

  getMyLocationData() {
    console.log(' authorizationService getToken  ' )
    const url = this.globals.API_URL + 'data-lat-lng';
    return this.http.get(url, {
      headers: {
        authorization: `Bearn ${this.authorizationService.getToken()}`
      }
    })/*.map(res => { return res.json() })*/;
  }

  getPlace() {
    const url = this.globals.API_URL + 'list-place';
    return this.http.get(url, {
      headers: {
        authorization: `Bearn ${this.authorizationService.getToken()}`
      }
    })/*.map(res => res.json())*/;
  }
}
