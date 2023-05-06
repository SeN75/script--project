import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ '../../register.scss','./signup.component.scss',]
})
export class SignupComponent {
  hide = true;
  form = new FormGroup({
    username: new FormControl<string>('', [Validators.required,]),
    email: new FormControl<string>('', [Validators.required,  Validators.email]),
    password: new FormControl<string>('', [Validators.required]),
  });
  get controls() {return this.form.controls}
  constructor(private registerSrv: AuthService) {

  }

  signup() {
    const {value} = this.form;
    if(this.form.valid)
      this.registerSrv.signup(value as any)

  }
}
