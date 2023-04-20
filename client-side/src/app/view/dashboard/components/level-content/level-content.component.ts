import { Component, Input, OnInit } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Lesson } from '../../pages/lesson.component';
import { DashboardService } from '../../dashboard.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Content } from '../../pages/content.component';

@Component({
  selector: 'level-content',
  templateUrl: './level-content.component.html',
  styleUrls: ['./level-content.component.scss']
})
export class LevelContentComponent implements OnInit{
  lessons: Lesson[] = []
 @Input() lesson?: Lesson
  lesson$?: Observable<Lesson | null>
  contents$?: Observable<Content[] | null>
  constructor(public dashSrv:DashboardService, private actvatedRoute: ActivatedRoute, private router: Router) {

  }
  ngOnInit(): void {

    this.loadData();
    this.router.events.subscribe(v => {

    })

  }
  loadData() {
    const lesson_id = (this.actvatedRoute.snapshot.paramMap.get('lesson') || -1) as number;
    this.lesson$ = this.dashSrv.currentLesson$
    this.contents$ = this.dashSrv.currentContents$
    // if(lesson_id) {
    //   this.lesson$ = this.dashSrv.getLessonById(lesson_id)
    // }
  }
}
