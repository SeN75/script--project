import { Component, OnInit } from '@angular/core';
import { DashboardService } from './../../dashboard.service';
import { Observable, first, map, tap, } from 'rxjs';
import { Subject } from '../subject.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DashDialogSrvice } from '../../dialog.service';
import { Lesson } from '../lesson.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  showFiller = false;
  subjects$?: Observable<Subject[]>
  subjects: Subject[]=[]
  isAdmin = true;
  isEdit = true;
  currentSubject = ''
  currentLesson?: Lesson;
  progress: any = {

  };
  lessons: Lesson [] = []
  user = {
    email: 'admin@script-project.com',
    name: 'admin script'
  }
  activePath = ''
  constructor(public dashSrv: DashboardService,
    private dashDialog: DashDialogSrvice,
    private activatedRouter: ActivatedRoute,
    private router: Router) {

  }
  ngOnInit(): void {
    this.subjects$ = this.dashSrv.getSubjects({lesson:true}).pipe(tap(data => {
      this.subjects = data;
      return data
    }));

    this.loadData();
  }
  async loadData() {
    const subject =  this.activatedRouter.snapshot.paramMap.get('subjectId')
    const lesson = this.activatedRouter.snapshot.paramMap.get('lesson');
    const type = this.activatedRouter.snapshot.paramMap.get('type') as ('admin' | 'doc');

    this.isAdmin = type == 'admin';
    this.isEdit = this.isAdmin;
    const subjects = await this.subjects$?.pipe(first()).toPromise()
    console.log(lesson)
    if(!subject  ) {
      // this.subjects$?.pipe(first(), map(data => data[0])).subscribe(subject => {
      //     if(lesson)
      //     this.router.navigate(['dashboard', 'admin', subject.id,{lesson}])
      //     else {
      //       console.log('here')
      //       this.router.navigate(['dashboard', 'admin', subject.id,{lesson: 0}])
      //       this.lessons = subject.Lesson || []
      //     }
      //     this.dashSrv.setCurrentSubject(subject, (+lesson! || 0))
      // })
     }
     else {
       this.activePath = subject +"";
        this.dashSrv.setCurrentSubject(subjects?.find(sub => sub.id == subject)!, type ,(+lesson! || 0))
     }
    //  this.lessons = this.subjects.find(s => s.id == subject)?.Lesson || [];
  }
  subjectDialog(status: 'add' | 'edit' = 'add', subject?: Subject) {
    this.dashDialog.subject(status,subject).afterClosed().subscribe(res => {
      if(res && res == 'load')
      this.subjects$ = this.dashSrv.getSubjects();
    });
  }
  deleteSubject(id: string) {
    this.dashDialog.message('حذف درس', 'هل تريد حقا حذف هذا الدرس', ()  => {
      this.dashSrv.deleteSubject(id).then(success => {
        if(success)
        this.subjects$ = this.dashSrv.getSubjects();

      })
    }, 'delete', 'حذف')
  }
  async selectSubject(sub: Subject) {
    const type = this.activatedRouter.snapshot.paramMap.get('type')
    this.dashSrv.setCurrentSubject(sub, type as any)
    setTimeout(async () => {

      const user: any = await this.dashSrv.getSubjectUserResult({subject_id: sub.id!})
      if(user && user.proggress){
        const total = (user.proggress.total_solved / user.proggress.total) * 100;
        this.progress = user.proggress
        this.progress.value = total;
        console.log(total)
      }
      console.log(user)
    }, 1000)
  }
}
