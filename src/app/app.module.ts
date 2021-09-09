import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptFormsModule, NativeScriptModule } from '@nativescript/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoginComponent } from './pages/login/login.component';
import { HomeScreenComponent } from './pages/homeScreen/homeScreen.component';
import { NotficationsComponent } from './pages/notfications/notfications.component';
import { TablesComponent } from './pages/tables/tables.component';

import { CacheService } from './shared/cache.service';
import { DataService } from './shared/data.service';
import { ConnectionService } from './shared/connection.service';

const pages = [
  LoginComponent,
  HomeScreenComponent,
  NotficationsComponent,
  TablesComponent
];
@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule, 
    AppRoutingModule,
    NativeScriptFormsModule,
  ],
  declarations: [AppComponent, ...pages],
  providers: [
    ConnectionService, CacheService, DataService
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
