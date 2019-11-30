import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from './authorization.service';
import { Globals } from '../../globals';

@Injectable()
export class AdminService {
  constructor(
    private authorizationService: AuthorizationService,
    private http: HttpClient,
    private globals: Globals
  ) { }

  setPlaceStatus(data?: object) {
    const url = this.globals.API_URL + 'change-status-of-place';
    /*this.http
      .put(url, data))
      .subscribe(data => console.log(data), err => console.log(err));*/

    return this.http.put(url, data)/*  .map(res => res.json()) */;
  }

  getLocationData() {
    const url = this.globals.API_URL + 'data-lat-lng';
    return this.http.get(url)/*  .map(res => res.json()) */;
  }

  getPlaceStatus() {
    const url = this.globals.API_URL + 'list-status-of-place';
    return this.http.get(url)/*  .map(res => res.json()) */;
  }
}
