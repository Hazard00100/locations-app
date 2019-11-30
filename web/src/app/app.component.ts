import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthorizationService } from './services/authorization.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import SocketService from "./services/socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loggedIn: boolean;
  uploadSuccessAlert: boolean;
  admin: boolean;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService,
    private modalService: NgbModal,
    private t2Sk: SocketService
  ) { }

  ngOnInit() {
    this.handleNavigate(this.authorizationService.loggedIn());
    this.authorizationService.getUserLoggedIn()
      .subscribe(result => this.handleNavigate(result));
  }

  login() {
    this.modalService.open(LoginComponent);
  }

  register() {
    this.modalService.open(RegisterComponent);
  }

  logout() {
    this.authorizationService.logOut();
    this.router.navigate(['/']);
  }

  handleNavigate(loggedIn: boolean) {
    this.loggedIn = loggedIn;
    if (loggedIn === true) {
      this.admin = this.authorizationService.getRole();
      /** Init socket here **/
      console.log(' THE SYSTEM INIT SOCKET ');
      this.t2Sk.initSocket(this.admin);
      if (this.admin === true) {
        this.router.navigate(['/admin']);
        console.log(' THE SYSTEM ROUTER TO ADMIN ');
      } else {
        this.router.navigate(['/location']);
        console.log(' THE SYSTEM ROUTER TO APP ');
      }
    }
  }

  upload() {
    /*const modalInstance = this.modalService.open(ImageUploadComponent);
    modalInstance.result.then(() => {
      this.uploadSuccessAlert = true;
      setTimeout(() => {
        this.uploadSuccessAlert = false;
        this.imagesComponent.fetchImages()
      }, 3000);
    });*/
  }
}
