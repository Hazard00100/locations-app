import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpRequest, HttpClientModule } from '@angular/common/http';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { ROUTING } from './app.routing';
import { NgbModule, NgbModal, NgbActiveModal  } from '@ng-bootstrap/ng-bootstrap';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { CountdownModule } from 'ngx-countdown';
import { NgxTimerModule } from 'ngx-timer';

import { Globals } from '../globals';
import { GOOGLE_API_API_KEY } from '../gk'
import { AppComponent } from './app.component';
import { AuthorizationService } from './services/authorization.service';
import SocketService from "./services/socket.service";

import { AdminComponent } from './admin/admin.component';
import { AdminService } from './services/admin.service';

import { LocationComponent } from './location/location.component';
import { LocationService } from './services/location.service';

import { NgbdModalShowPickPlaceInfo } from './location/ModalsShowPickPlaceInfo/showPickPlaceInfo.cmp';
import { ModalWaitingGetCar } from './location/ModalWaitingGetCar/ModalWaitingGetCar.cmp';
import { ModalStartCar } from './location/ModalStartCar/ModalStartCar.cmp';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { HelpComponent } from './help/help.component';
import { HelpService } from './services/help.service';

import { AboutAppComponent } from './about-app/about.app.component';
import { AboutAppService } from './services/about.app.service';

import { ContactComponent } from './contact/contact.component';
import { ContactService } from './services/contact.service';

/*export function authHttpServiceFactory(http: HttpClient, options: HttpRequest) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => localStorage.getItem('token'))
  }), http, options);
}*/
export function jwtOptionsFactory(authService) {
  return {
    tokenGetter: (() => localStorage.getItem('token'))
  }
}

console.log(' GOOGLE_API_API_KEY ', Globals)

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NgbdModalShowPickPlaceInfo,
    ModalWaitingGetCar,
    ModalStartCar,

    AdminComponent,
    LocationComponent,
    HelpComponent,
    AboutAppComponent,
    ContactComponent,

  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    NgbdModalShowPickPlaceInfo,
    ModalWaitingGetCar,
    ModalStartCar
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ROUTING,
    HttpClientModule,
    // Jwt Token Injection
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [AuthorizationService]
      }
    }),
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: GOOGLE_API_API_KEY
    }),
    AgmDirectionModule,     // agm-
    CountdownModule,
    NgxTimerModule,
  ],
  providers: [
    AuthorizationService,
    NgbModal,
    NgbActiveModal,
    AdminService,
    LocationService,
    HelpService,
    AboutAppService,
    ContactService,
    SocketService,
    /*{
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },*/
    Globals,
    {provide: APP_BASE_HREF, useValue : '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
