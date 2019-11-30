import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LocationComponent } from './location/location.component';
import { HelpComponent } from './help/help.component';
import { AboutAppComponent } from './about-app/about.app.component';
import { ContactComponent } from './contact/contact.component';


export const AppRoutes: Routes = [
  /*{ path: '/', component: AppComponent },*/
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'location', component: LocationComponent },
  { path: 'help', component: HelpComponent },
  { path: 'about-app', component: AboutAppComponent },
  { path: 'contact', component: ContactComponent },

];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
