import { Component, OnInit } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { MapsAPILoader } from '@agm/core';
// import { LocationService } from '../services/location.service';
// import SocketService from "../services/socket.service";

declare var google: any;
declare var clearTimeout: any;
declare var JSON: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styles: [`
    agm-map {
      height: ${window.innerHeight - 150}px;
    }
  `],
  styleUrls: []
})

export class ContactComponent implements OnInit {
  lat: number = 10.801241; // lat HANG XANH
  radius: number = 20000; // 20km
  address: string;
  mkVisible: boolean = false;
  listApprovedPlace: any = [];

  constructor(
    // private locationService: LocationService,
    // private activeModal: NgbActiveModal,
    // private mapsAPILoader: MapsAPILoader,
    // private t2Sk: SocketService,
  ) {}

  ngOnInit() {
    console.log('----- ngOnInit ----');
  }
}
