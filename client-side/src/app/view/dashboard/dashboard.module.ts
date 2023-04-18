import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { DashboardRoutes } from './dashboard.routing';
import { TableComponent } from './components/table.component';
import { SideContainerComponent } from './components/side-container.component';
import { BreadCraumbComponent } from './components/breadcrumb.component';
import { SidebarComponent } from './components/sidebar.component';
import { SidemenuComponent } from './components/sidemenu.component';


import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import  {MatDialogModule}  from '@angular/material/dialog'
import  {MatSnackBarModule}  from '@angular/material/snack-bar'
import  {MatToolbarModule}  from '@angular/material/toolbar'
import  {MatCardModule}  from '@angular/material/card';
import  {MatProgressSpinnerModule}  from '@angular/material/progress-spinner';
import { SubjectComponent } from './pages/subject.component';
import { LessonComponent } from './pages/lesson.component';
import { ContentComponent } from './pages/content.component';
import { ExericesComponent } from './pages/exerices.component'


@NgModule({
  declarations: [
    DashboardComponent,
    TableComponent,
    SideContainerComponent,
    BreadCraumbComponent,
    SidebarComponent,
    SidemenuComponent,
    SubjectComponent,
    LessonComponent,
    ContentComponent,
    ExericesComponent
  ],
  imports: [
CommonModule,
  TranslateModule,
  ReactiveFormsModule,
  RouterModule.forChild([{path: '', component: DashboardComponent, children: DashboardRoutes}]),
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatButtonModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatCardModule,
  MatProgressSpinnerModule
  ]
})
export class DashboardModule { }
