import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: [ '../../register.scss','./signup.component.scss',]
})
export class SignupComponent {
  hide = false;
  form = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.email]),
    email: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required]),
  });

  get controls() {return this.form.controls}
}
