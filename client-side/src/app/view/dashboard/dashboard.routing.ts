import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { SubjectComponent } from "./pages/subject.component";
import { LessonComponent } from "./pages/lesson.component";
import { ContentComponent } from "./pages/content.component";
import { ExericesComponent } from "./pages/exerices.component";
import { AdminComponent } from "./pages/admin/admin.component";
import { DashboardGuard } from "./dashboard.guard";


export const DashboardRoutes: Routes = [
  {path: '', redirectTo: "admin", pathMatch: 'full' },
  {path: ':type', component: AdminComponent, canActivate: [DashboardGuard]},
  {path: ':type/:subjectId', component: AdminComponent, canActivate: [DashboardGuard]},
  {path: ':type/:subjectId/:lessonId', component: AdminComponent, canActivate: [DashboardGuard]},
]
