import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService, User } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

  form = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  })
  user$:Observable<User | null>
  get controls() {return this.form.controls};
  constructor(private authSrv: AuthService, private router: Router) {
    this.user$ = this.authSrv.user$.pipe(tap(data => this.form.patchValue(data)))
  }
  update() {
    const {value} = this.form
    if(this.form.valid)
      this.authSrv.update(value as User);
  }
  logout() {
    this.authSrv.logout().then((data) => {
      if(data)
        this.router.navigate(['/register',])
    })
  }
}
