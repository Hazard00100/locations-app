import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ModalStartCar',
  templateUrl: './ModalStartCar.html'
})
export class ModalStartCar {
  data: any = null;
  config: any = null;
  constructor(public modal: NgbActiveModal) {}
  ngOnInit() {
    console.log(this.data);
  }
}
