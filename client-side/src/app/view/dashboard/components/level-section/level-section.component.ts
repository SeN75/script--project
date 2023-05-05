import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DashboardService } from '../../dashboard.service';
import { Observable, first, map } from 'rxjs';
import { Lesson } from '../../pages/lesson.component';
import { FormControl } from '@angular/forms';
import { LoggerService } from 'src/app/services/logger.service';
import { DashDialogSrvice } from '../../dialog.service';

@Component({
  selector: 'level-section',
  templateUrl: './level-section.component.html',
  styleUrls: ['./level-section.component.scss'],
})
export class LevelSectionComponent implements OnInit {
  lessons$?: Observable<Lesson[]>;
  @Input() lessons: Lesson[] = [];
  @Output() selectedLesson = new EventEmitter<Lesson>();
  @Input() isEdit = false;
  subject_id = '';
  levelCtrl = new FormControl<string>('');
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dashSrv: DashboardService,
    private dashDialog: DashDialogSrvice,
    private logger: LoggerService
  ) {}
  ngOnInit(): void {
    this.loadData();

    this.router.events.subscribe((v) => {
      if (v instanceof NavigationEnd) {
      }
      // this.loadData()
    });
    this.levelCtrl.valueChanges.subscribe((v) => {

      // this.router.navigate(['dashboard', 'admin', this.subject_id,{lesson: this.lessons.findIndex(d => d.id == v)}])
      const index = this.dashSrv.currentSubject?.Lesson?.findIndex(
        (d) => d.id == v
      )!;
      const { subjectId } = this.activatedRoute.snapshot.params;
      this.dashSrv.setCurrentLesson(
        this.dashSrv.currentSubject?.Lesson?.find((d) => d.id == v)!,

        { subjectId: this.dashSrv.currentSubject?.id!, lesson: index, role: this.router.url.includes('admin') ? 'admin' : 'doc' }
      );
    });
  }
  loadData() {
    this.lessons$ = this.dashSrv.lessons$;

    this.lessons$.subscribe((v) => {});
  }

  getLessons() {
    return this.dashSrv.currentSubject?.Lesson || [];
  }
  addLesson() {

    this.dashDialog.lesson('add', this.dashSrv.currentSubject?.id!)
  }


  deleteLesson() {
    const id = this.levelCtrl.value!
    this.dashDialog.message('حذف درس', 'هل تريد حقا حذف هذا الدرس', ()  => {
      this.dashSrv.deleletLesson(id).then(success => {
        if(success)
          this.dashSrv.updateCurrentSubject(this.activatedRoute.snapshot.paramMap.get('type') as ('admin' | 'doc'))

      })
    }, 'delete', 'حذف')
  }
}
