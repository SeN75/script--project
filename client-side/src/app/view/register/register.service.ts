import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger.service';
import { API } from 'src/app/common/api.config';
import { BehaviorSubject, first } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private user = new BehaviorSubject<User>({} as User);
  get user$() {return this.user.asObservable()};

  constructor(
    private http: HttpClient, private toaster: MatSnackBar, private logger: LoggerService, private router: Router,
  ) {
    this.user.subscribe(user => this.logger.log('user ==> ', user))
    if(localStorage['scriptUser'])
      this.user.next(JSON.parse(localStorage['scriptUser']));
  }


// ===================================
// =========== registraion ===========
// ===================================


login(data: LoginCredential) {

 return this.http.post<User>(`${API}/auth/login`, data).pipe(first()).toPromise()
 .then((user) => {
  this.logger.log('success loggedin!' , user)
  if(user) {
    this.router.navigate(['home'])
    localStorage['scriptUser'] = JSON.stringify(user);
    this.user.next(user);
  }
  return user
  })
  .catch(error => {
    this.alert(error.error.message, false)
    this.logger.error('user not found ==> ', error)
    return false;
  })
}
signup(data: SignupCredential) {

 this.http.post<User>(`${API}/auth/signup`, data).pipe(first()).toPromise()
 .then((user) => {
  this.logger.log('success signup!' , user)
  if(user) {
    this.router.navigate(['register', 'login'])
    localStorage['scriptUser'] = user;
    this.user.next(user);
  }
  })
  .catch(error => {
    this.logger.error('user not found ==> ', error)
    this.alert(error.message, false)
  })
}
  alert(message: string, isSuccess: boolean) {
    this.toaster.open(message, undefined, {
      panelClass: isSuccess ? 'success-msg' : 'error-msg',
      duration: 5000,
    })
  }
}


export interface User {
  id?: string,
  email: string,
  username?: string,
  point: number;
  create_at?: Date;
  role: 'learner' | 'admin'
}

export interface LoginCredential {
  email: string,
  password: string;
}
export interface SignupCredential {
  email: string,
  password: string,
  username?: string,
}
