import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../services/admin.service';
import SocketService from "../services/socket.service";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  arrLocations: any = [];
  arrPlaceStatus: any = [];

  constructor(
    private adminService: AdminService,
    private activeModal: NgbActiveModal,
    private t2Sk: SocketService
  ) { }

  ngOnInit() {

    /** GET LOCATION DATA FOR ADMIN **/
    this.adminService.getLocationData().subscribe(
      r => {
        console.log('getLocationData', r);
        this.arrLocations = r.data;
      },
      e => console.log(e)
    );

    /** GET LIST PLACE STATUS FOR ADMIN **/
    this.adminService.getPlaceStatus().subscribe(
      r => {
        console.log('getPlaceStatus', r);
        this.arrPlaceStatus = r.data;
      },
      e => console.log(e)
    );
  }

  getPlaceStatus(id) {
     return this.arrPlaceStatus.find(d => d.id === id).name;
  }

  compareStatus(id, statusId) {
    return id === statusId ? 'selected' : null;
  }

  changePlaceStatus(statusId, place) {
    console.log(statusId);
    console.log(place);

    this.adminService
      .setPlaceStatus({...place, statusId})
      .subscribe(
        r => console.log(r),
        e => console.log(e)
      );
  }
}
