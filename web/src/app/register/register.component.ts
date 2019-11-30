import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthorizationService } from '../services/authorization.service';
import { User } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
  user: User = new User();
  errorMessage: string;

  constructor(private authorizationService: AuthorizationService, private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  register() {
    this.authorizationService.register(this.user).subscribe(
      data => {
        if (data.success) {
          this.authorizationService.setUserData(data);
          this.authorizationService.setToken(data.token, data.admin);
          this.activeModal.close();
        }
        else {
          this.displayErrorMessage(data.message);
        }
      },
      err => this.displayErrorMessage(err));
  }

  displayErrorMessage(msg) {
    console.log(msg._body);
    let txt = (msg && msg._body && JSON.parse(msg._body) || msg || {});
    this.errorMessage = txt ? txt.message : 'An error has occured.  Please try again.';
  }

}
