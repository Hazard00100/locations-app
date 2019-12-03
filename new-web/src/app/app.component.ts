import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthorizationService } from './services/authorization.service';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import SocketService from "./services/socket.service";

declare var document: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  loggedIn: boolean;
  uploadSuccessAlert: boolean;
  admin: boolean;
  isNavbarCollapsed: boolean = true;

  constructor(
    private router: Router,
    private authorizationService: AuthorizationService,
    private modalService: NgbModal,
    private t2Sk: SocketService
  ) { }

  ngOnInit() {
    console.log(' ngOnInit this.authorizationService.loggedIn()', this.authorizationService.loggedIn());
    this.handleNavigate(this.authorizationService.loggedIn());
    this.authorizationService.getUserLoggedIn()
      .subscribe(result => this.handleNavigate(result));

    if (!this.loggedIn) this.router.navigate(['login']);
  }

  login() {
    // this.modalService.open(LoginComponent);
    this.router.navigate(['login']);
  }

  register() {
    // this.router.navigate(['register']);
    this.modalService.open(RegisterComponent);
  }

  logout() {
    this.authorizationService.logOut();
    this.router.navigate(['login']);
  }

  handleNavigate(loggedIn: boolean) {
    console.log(' handleNavigateT ');
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
        if (
          document.location.pathname === '/' ||
          document.location.pathname === '/login' ||
          document.location.pathname === '/register'
        ) {
          this.router.navigate(['/location']);
        }
        console.log(' THE SYSTEM ROUTER TO APP ', );
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
