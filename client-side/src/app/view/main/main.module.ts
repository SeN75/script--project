import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';


@NgModule({
  declarations: [
    MainComponent
  ],
  imports: [
  CommonModule,
  TranslateModule,
  RouterModule.forChild([{path:'', component: MainComponent}]),
  ComponentsModule
  ]
})
export class MainModule { }
