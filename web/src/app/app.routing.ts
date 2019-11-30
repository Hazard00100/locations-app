import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core/src/metadata/ng_module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { LocationComponent } from './location/location.component';

export const AppRoutes: Routes = [
  /*{ path: '/', component: AppComponent },*/
  { path: 'admin', component: AdminComponent },
  { path: 'location', component: LocationComponent },
];

export const ROUTING: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
