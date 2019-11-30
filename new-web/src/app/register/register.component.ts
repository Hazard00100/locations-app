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
    this.user.dob = new Date();
  }

  register() {
    console.log(this.user);
    if (
      !this.user ||
      Object.keys(this.user).length < 7
    ) {
      this.errorMessage = 'This field is required';
    } else 
      this.authorizationService.register(this.user).subscribe(
        (data: any) => {
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
  onInputDateChange(evt: any) {
    console.log(evt.target)    
  }

  onUploadChange(evt: any) {
    const file = evt.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  handleReaderLoaded(e: any) {
    this.user.driverLincense = 'data:image/png;base64,' + btoa(e.target.result);
  }

}
