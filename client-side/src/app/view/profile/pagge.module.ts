import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ComponentsModule } from 'src/app/components/components.module';

import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { ProfileGuard } from './profile.guard';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [

    CommonModule,
    RouterModule.forChild([{path: '', component: ProfileComponent, canActivate: [ProfileGuard]}]),
    ComponentsModule,
    ReactiveFormsModule,
    MatButtonModule
  ],

})

export class ProfileModule {}
