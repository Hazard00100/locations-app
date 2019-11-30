import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapsAPILoader } from '@agm/core';
import { LocationService } from '../services/location.service';
import SocketService from "../services/socket.service";

declare var google: any;
declare var clearTimeout: any;
declare var JSON: any;

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styles: [`
    agm-map {
      height: ${window.innerHeight - 150}px;
    }
  `],
  styleUrls: []
})

export class LocationComponent implements OnInit {
  geocoder: any;

  lat: number = 10.801241; // lat HANG XANH
  lng: number = 106.712710; // lng HANG XANH
  zoom: number = 11.5;
  radius: number = 20000; // 20km
  address: string;

  mkDraggable: boolean = true;
  mkVisible: boolean = false;

  listApprovedPlace: any = [];
  listPlace: any = [];

  constructor(
    private locationService: LocationService,
    private activeModal: NgbActiveModal,
    private mapsAPILoader: MapsAPILoader,
    private t2Sk: SocketService,
  ) {}

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((p) => this.showPosition(p));
    const timeOut = setTimeout(() => {
      this.mapsAPILoader.load().then(() => {
        console.log('google script loaded');
        this.geocoder = new google.maps.Geocoder();
      });
      clearTimeout(timeOut);
    }, 500);

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
      this.callGeocode();
    }
  }

  placeMarker($event) {
    console.log($event.coords.lat);
    console.log($event.coords.lng);
    this.setLatlng($event.coords.lat, $event.coords.lng);
  }

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || this.getPlaceLetter(index)}`);
  }

  markerDragEnd(m, $event) {
    console.log('dragEnd', m, $event);
    this.setLatlng($event.coords.lat, $event.coords.lng);
    this.callGeocode();
    this.locationService
      .sendCurrentLatLng(this.getLatLng())
      .subscribe(
        data => console.log(data),
        err => console.log(err)
      );

    /** Ignore user click to much times **/
    this.mkDraggable = false;
    const tm = setTimeout(() => {
      this.mkDraggable = true;
      clearTimeout(tm);
    }, 5000);
  }

  callGeocode() {
    if (!this.geocoder && google) {
      this.geocoder = new google.maps.Geocoder();
    }
    this.geocoder.geocode({'location': this.getLatLng()}, (results, status) => this.getAddress(results, status));
  }

  getAddress(results, status) {
    if (status === 'OK') {
      if (results) {
        console.log('getAddress   ', results);
        this.address = results[0].formatted_address
      }
    } else {
      console.log('Reverse Geocoding failed because: ' + status);
    }
  }

  getPlaceLetter(id) {
    return this.listPlace.find(p => p.id === id).name[0].toUpperCase();
  }
}
