import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagelayoutComponent } from './pagelayout/pagelayout.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import {MatListModule} from '@angular/material/list';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PagelayoutComponent
  ],
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
  ],
  exports: [
    PagelayoutComponent
  ]

})
export class ComponentsModule { }
