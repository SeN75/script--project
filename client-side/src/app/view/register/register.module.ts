import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';
import { RegisterComponent } from './register.component';
import { RegisterRoutes } from './register.routing';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';


@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
  CommonModule,
  TranslateModule,
  RouterModule.forChild([{path:'', component: RegisterComponent, children: RegisterRoutes}]),
  ComponentsModule,
  MatButtonModule,
  ComponentsModule,
  ReactiveFormsModule,
  MatIconModule,
  MatRippleModule
  ]
})
export class MainModule { }
