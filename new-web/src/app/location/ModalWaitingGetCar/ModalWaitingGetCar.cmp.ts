import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'showModalWaitingGetCar',
  templateUrl: './ModalWaitingGetCar.html'
})
export class ModalWaitingGetCar {
  data: any = null;
  config: any = null;
  constructor(public modal: NgbActiveModal) {}
  ngOnInit() {
    console.log(this.data);
  }
}