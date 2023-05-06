import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', loadChildren: () => import('./view/dashboard/dashboard.module').then(m => m.DashboardModule)},
  {path: 'home', loadChildren: () => import('./view/main/main.module').then(m => m.MainModule)},
  {path: 'register', loadChildren: () => import('./view/register/register.module').then(m => m.RegisterModule)},
  {path: 'profile' , loadChildren: () => import('./view/profile/pagge.module').then(m  => m.ProfileModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
