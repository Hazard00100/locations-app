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
  lat: number = -2213; // lat HANG XANH
  lng: number = -2213; // lng HANG XANH
  zoom: number = 15;
  radius: number = 1000; // 20km
  address: string;

  mkDraggable: boolean = true;
  mkVisible: boolean = false;

  listApprovedPlace: any = [];
  currPlace: any = null;
  listPlace: any = [];
  origin: any = null;
  destination: any = null;
  renderOptions = {
    suppressMarkers: true,
  }

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
      this.callGeocode();
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
    // this.listApprovedPlace = this.listApprovedPlace.map(d => ({...d, isClicked: false}))
    m.isClicked = true
    this.destination = { lat: m.point.x, lng:  m.point.y };
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
    if (
      !this.geocoder &&
      typeof google === "object" &&
      typeof this.geocoder.geocode === "object"
    ) {
      this.geocoder = new google.maps.Geocoder();
      this.geocoder.geocode({'location': this.getLatLng()}, (results, status) => this.getAddress(results, status));
    }
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
    console.log('this.listPlace ', this.listPlace)
    return this.listPlace.find(p => p.id === id).name[0].toUpperCase();
  }
}
