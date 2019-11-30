import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorizationService } from '../services/authorization.service';
import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  user: User = new User();
  errorMessage: string;

  constructor(private authorizationService: AuthorizationService, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  login() {
    this.authorizationService.login(this.user).subscribe(
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
