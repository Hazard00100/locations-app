import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';

import { AuthorizationService } from './authorization.service';
import { Globals } from '../../globals';

@Injectable()
export class AdminService {
  constructor(
    private authorizationService: AuthorizationService,
    private http: Http,
    private authHttp: AuthHttp,
    private globals: Globals
  ) { }

  setPlaceStatus(data: object) {
    const url = this.globals.API_URL + 'change-status-of-place';
    return this.authHttp.put(url, data).map(res => { return res.json() });
  }

  getLocationData() {
    const url = this.globals.API_URL + 'data-lat-lng';
    return this.authHttp.get(url).map(res => res.json());
  }

  getPlaceStatus() {
    const url = this.globals.API_URL + 'list-status-of-place';
    return this.authHttp.get(url).map(res => res.json());
  }
}
