import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ExericesComponent } from './pages/exerices.component';
import { AdminComponent } from './pages/admin/admin.component'
import {MatSidenavModule} from '@angular/material/sidenav';
import { IconService } from 'src/app/services/icon.service';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { SubjectDialogComponent } from './dialogs/subject-dialog.component';
import { DashDialogSrvice } from './dialog.service';
import { DashboardService } from './dashboard.service';
import { MessageDialogComponent } from './dialogs/message-dialog.component';
import { MatRippleModule } from '@angular/material/core';
import { TabOfContentComponent } from './components/tab-of-content/tab-of-content.component';
import { LevelSectionComponent } from './components/level-section/level-section.component';
import { LevelContentComponent } from './components/level-content/level-content.component';

import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { CodeEditorComponent } from './components/code-editor.component';
import { LessonDialogComponent } from './dialogs/lesson-dialog.component';
import { ComponentsModule } from 'src/app/components/components.module';

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
    ExericesComponent,
    AdminComponent,
    SubjectDialogComponent,
    MessageDialogComponent,
    TabOfContentComponent,
    LevelSectionComponent,
    LevelContentComponent,
    CodeEditorComponent,
    LessonDialogComponent
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
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatSlideToggleModule,
  FormsModule,
  MatDialogModule,
  MatRippleModule,
  HighlightModule,
  ComponentsModule

  ],
  providers: [IconService, DashDialogSrvice, DashboardService,
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          javascript: () => import('highlight.js/lib/languages/javascript'),
        },
      }
    }
  ]
})
export class DashboardModule { }
