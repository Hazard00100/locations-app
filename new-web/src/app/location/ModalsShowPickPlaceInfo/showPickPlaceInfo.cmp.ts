import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'showPickPlaceInfo',
  templateUrl: './pickACar.html'
})
export class NgbdModalShowPickPlaceInfo {
  data: any = null;
  constructor(public modal: NgbActiveModal) {}
  ngOnInit() {
    console.log(this.data);
  }
}
