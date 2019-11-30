import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Http, RequestOptions } from '@angular/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { ROUTING } from './app.routing';
import { NgbModule, NgbModal, NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AgmCoreModule } from '@agm/core';

import { Globals } from '../globals';
import { AppComponent } from './app.component';
import { AuthorizationService } from './services/authorization.service';
import SocketService from "./services/socket.service";

import { AdminComponent } from './admin/admin.component';
import { AdminService } from './services/admin.service';

import { LocationComponent } from './location/location.component';
import { LocationService } from './services/location.service';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('token'))
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,

    AdminComponent,
    LocationComponent
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ROUTING,
    HttpModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBRlrTYjkjBrpZ7ScRFtStne0aOOeoddVc'
    }),
  ],
  providers: [
    AuthorizationService,
    NgbModal,
    NgbActiveModal,
    AdminService,
    LocationService,
    SocketService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    Globals,
    {provide: APP_BASE_HREF, useValue : '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
