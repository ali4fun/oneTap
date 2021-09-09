import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'
import { NativeScriptRouterModule } from '@nativescript/angular'

import { NotficationsComponent } from './pages/notfications/notfications.component';
import { LoginComponent } from './pages/login/login.component'
import { HomeScreenComponent } from './pages/homeScreen/homeScreen.component'
import { TablesComponent } from './pages/tables/tables.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeScreenComponent},
  { path: 'notification', component: NotficationsComponent},
  { path: 'tables', component: TablesComponent}
]

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
