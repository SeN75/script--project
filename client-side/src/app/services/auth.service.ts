import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoggerService } from 'src/app/services/logger.service';
import { API } from 'src/app/common/api.config';
import { BehaviorSubject, first, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User>({} as User);
  get user$() {
    return this.user.asObservable();
  }
  userData: User | null = null
  constructor(
    private http: HttpClient, private toaster: MatSnackBar, private logger: LoggerService, private router: Router,
  ) {
    this.user$.subscribe(user => {
      this.userData = user;
      this.logger.log('userData ==> ', this.userData)
    })
    if(localStorage['scriptUser'])
      this.user.next(JSON.parse(localStorage['scriptUser']));
  }


// ===================================
// =========== registraion ===========
// ===================================


login(data: LoginCredential) {

 return this.http.post<User>(`${API}/auth/login`, data).pipe(first(), switchMap(userData => {
  this.user.next(userData);
  this.logger.log('after change userData ==> ', this.userData)
  return of(userData)
 })).toPromise()
 .then((user) => {
  if(user) {
    const url = '/dashboard/'+ (user.role == 'admin' ? 'admin' : 'doc');
    this.router.navigateByUrl(url)
    localStorage['scriptUser'] = JSON.stringify(user);
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
