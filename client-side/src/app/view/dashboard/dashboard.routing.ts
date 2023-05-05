import { Routes } from "@angular/router";
import { AdminComponent } from "./pages/admin/admin.component";
import { DashboardGuard } from "./dashboard.guard";


export const DashboardRoutes: Routes = [
  {path: '', redirectTo: "admin", pathMatch: 'full' },
  {path: 'admin', component: AdminComponent, canActivate: [DashboardGuard]},
  {path: 'admin/:subjectId', component: AdminComponent, canActivate: [DashboardGuard]},
  {path: 'admin/:subjectId/:lessonId', component: AdminComponent, canActivate: [DashboardGuard]},
  {path: 'doc', component: AdminComponent},
  {path: 'doc/:subjectId', component: AdminComponent},
  {path: 'doc/:subjectId/:lessonId', component: AdminComponent},
]
