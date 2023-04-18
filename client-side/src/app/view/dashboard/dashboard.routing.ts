import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { SubjectComponent } from "./pages/subject.component";
import { LessonComponent } from "./pages/lesson.component";
import { ContentComponent } from "./pages/content.component";
import { ExericesComponent } from "./pages/exerices.component";


export const DashboardRoutes: Routes = [
  {path: '', redirectTo: "subject", pathMatch: 'full' },
  {path: 'subject', component: SubjectComponent},
  {path: 'lesson', component: LessonComponent},
  {path: 'content', component: ContentComponent},
  {path: 'exerices', component: ExericesComponent},
]
