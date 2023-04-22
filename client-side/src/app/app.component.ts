import { Component } from '@angular/core';
import { LanguageService } from './services/language.service';
import { RegisterService } from './view/register/register.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'project';
  constructor (private lang: LanguageService, private registerSrv: RegisterService) {}
}
