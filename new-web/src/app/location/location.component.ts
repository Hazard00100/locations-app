import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from '../services/location.service';
import SocketService from "../services/socket.service";
import { countUpTimerConfigModel, CountupTimerService } from 'ngx-timer';

import { NgbdModalShowPickPlaceInfo } from './ModalsShowPickPlaceInfo/showPickPlaceInfo.cmp'
import { ModalWaitingGetCar } from './ModalWaitingGetCar/ModalWaitingGetCar.cmp'
import { ModalStartCar } from './ModalStartCar/ModalStartCar.cmp'

declare var google: any;
declare var clearTimeout: any;
declare var JSON: any;
const TIME_OPEN_POP_UP: number = 1000

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styles: [`
    agm-map {
      height: ${window.innerHeight - 150}px;
    },
    .modal {
      position:fixed;
      top:auto;
      right:auto;
      left:auto;
      bottom:0;
    }
  `],
  styleUrls: []
})

export class LocationComponent {
  geocoder: any;
  lat: number = -2213; // lat HANG XANH
  lng: number = -2213; // lng HANG XANH
  zoom: number = 15;
  radius: number = 1000; // 20km
  address: string;

  mkDraggable: boolean = true;
  mkVisible: boolean = false;
  isShowAgmDirection: boolean = false;

  listApprovedPlace: any = [];
  currPlace: any = null;
  listPlace: any = [];
  origin: any = null;
  destination: any = null;
  distance2Point: any = null;
  countUpConfig: any = null;
  travelMode: string = 'WALKING';
  renderOptions = {
    suppressMarkers: true
  };

  constructor(
    private locationService: LocationService,
    private _countupTimerService: CountupTimerService,
    private _modalService: NgbModal,
    private mapsAPILoader: MapsAPILoader,
    private t2Sk: SocketService,
  ) {}

  ngOnInit() {
    const timeOut = setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        console.log('google script loaded');
        this.geocoder = new google.maps.Geocoder();
        navigator.geolocation.getCurrentPosition((p) => this.showPosition(p));
        this.callGeocode();
        clearTimeout(timeOut);
      });
    }, 0);

    this.listApprovedPlace = [];

    this.t2Sk.getSK().on('APPROVE_PLACE', data => {
      console.log(data);
      this.listApprovedPlace.push(data);
    });

    this.locationService.getPlace()
      .subscribe(
        (r: {data: any;}) => {
          this.listPlace = r.data;
        },
        e => console.log(e)
      );

    this.locationService.getMyLocationData()
      .subscribe(
        (r: {data: any;}) => {
          this.listApprovedPlace = r.data;
        },
        e => console.log(e)
      );
  }

  setLatlng(lat, lng) {
    this.lat = lat;
    this.lng = lng;
    this.mkVisible = true;
    this.locationService
      .sendCurrentLatLng({lat, lng})
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );
    this.origin = {lat, lng};
  }

  getLatLng() {
    return {
      lat: this.lat,
      lng: this.lng
    }
  }

  showPosition(position) {
    if (position && position.coords) {
      this.setLatlng(position.coords.latitude, position.coords.longitude);
    }
  }

  placeMarker($event) {
    console.log($event.coords.lat);
    console.log($event.coords.lng);
    this.setLatlng($event.coords.lat, $event.coords.lng);
  }

  clickedMarker(m: any) {
    if (!this.currPlace) this.currPlace = m
    else {
      this.currPlace.isClicked = false;
      this.currPlace = null
      this.currPlace = m
    }
    console.log(`clicked the marker:`, m);
    console.log(`All the marker:`, this.listApprovedPlace);
    // this.listApprovedPlace = this.listApprovedPlace.map(d => ({...d, isClicked: false}))
    m.isClicked = true
    this.destination = { lat: m.point.x, lng:  m.point.y };
    this.getDistance2Point()
    this.isShowAgmDirection = true
  }

  markerDragEnd(m, $event) {
    console.log('dragEnd', m, $event);
    this.setLatlng($event.coords.lat, $event.coords.lng);
    this.callGeocode();
    /** Ignore user click to much times **/
    this.mkDraggable = false;
    const tm = setTimeout(() => {
      this.mkDraggable = true;
      clearTimeout(tm);
    }, 5000);
  }

  callGeocode() {
    this.geocoder.geocode({'location': this.getLatLng()}, (results, status) => this.getAddress(results, status));
  }

  getAddress(results, status) {
    if (status === 'OK') {
      if (results) {
        this.address = results[0].formatted_address
      }
    } else {
      console.log('Reverse Geocoding failed because: ' + status);
    }
  }

  getPlaceLetter(id) {
    console.log('this.listPlace ', this.listPlace)
    return this.listPlace.find(p => p.id === id).name[0].toUpperCase();
  }

  getDistance2Point() {
    const org = new google.maps.LatLng(this.origin.lat, this.origin.lng);
    const dest = new google.maps.LatLng(this.destination.lat, this.destination.lng);
    this.distance2Point = google.maps.geometry.spherical.computeDistanceBetween(org, dest) / 1000; // km
    console.log('getDistance2Point ', this.distance2Point);
    this.openModalShowPickPlace()
  }

  openModalShowPickPlace() {
    const timeOut = setTimeout(() => {
      this._modalService.open(NgbdModalShowPickPlaceInfo)
        .componentInstance
        .data = {
        ...this.currPlace,
        distance2Point: this.distance2Point,
        onClickOk: (m) => {
          this.isShowAgmDirection = true

          /* waiting pickup car */
          this.openModalShowWaitingPlace()
          m.close('Ok click')
        }
      };
      clearTimeout(timeOut)
    }, TIME_OPEN_POP_UP)
  }

  openModalShowWaitingPlace() {
    const timeOut = setTimeout(() => {
      const md = this._modalService.open(ModalWaitingGetCar);
      md.componentInstance
        .data = {
          ...this.currPlace,
          distance2Point: this.distance2Point,
          onClickOk: (m) => {
            /*** Hanlde here  ***/
            this.openModalStartCar()
            m.close('Ok click')
          },
          onClickCancel: (m) => {
            this.isShowAgmDirection = false
            m.close('Cancel click')
          },
          handleTMEvent(e: any) {
            console.log('handleEvent ', e)
            if (e.action === 'done') {
              this.isShowAgmDirection = false
              md.close('Cancel click')
            }
          }
      };
      clearTimeout(timeOut)
    }, TIME_OPEN_POP_UP)
  }

  openModalStartCar() {
    this.countUpConfig = new countUpTimerConfigModel();
    const timeOut = setTimeout(() => {
      const md = this._modalService.open(ModalStartCar);
      md.componentInstance
        .data = {
        countUpConfig: this.countUpConfig,
        ...this.currPlace,
        distance2Point: this.distance2Point,
        onClickEnd: (m) => {
          this.isShowAgmDirection = false
          m.close('Ok click')
        },
        handleTMEvent(e: any) {
          console.log('openModalStartCar', e)
        }
      };
      clearTimeout(timeOut)
    }, TIME_OPEN_POP_UP);
    this._countupTimerService.stopTimer();
    this._countupTimerService.startTimer();
  }
}
