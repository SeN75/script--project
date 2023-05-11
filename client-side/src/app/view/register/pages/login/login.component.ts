import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../../register.scss']
})
export class LoginComponent {
  hide = true;
  form = new FormGroup({
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>('', [Validators.required])
  })
  get controls () {return this.form.controls}

  constructor(private registerSrv: AuthService, private logger: LoggerService) {

  }

  login() {
    const {value} = this.form;
    this.logger.log('login ==> ', value)
    if(this.form.valid)
    this.registerSrv.login(value as any)
    else this.registerSrv.alert('الرجاء التحقق من جميع المدخلات', false)

  }
}
