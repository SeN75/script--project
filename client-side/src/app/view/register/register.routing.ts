import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { SignupComponent } from "./pages/signup/signup.component";

export const RegisterRoutes: Routes = [
  {path: '', redirectTo: 'login' , pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignupComponent},
]
