import { Injectable } from '@angular/core';
import { DashboardService } from './dashboard.service';
import { Observable } from 'rxjs';
import { Subject } from './pages/subject.component';
import { Lesson } from './pages/lesson.component';

@Injectable({
  providedIn: 'root'
})
export class LoadDataService {
  selectedSujbect?:Observable<Subject>
  selectedLesson?: Observable<Lesson>
  constructor(private dashSrv: DashboardService) { }


}
