import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'sidemenu',
  template: `
    <section class="menu-container">
      <header>{{ header }}</header>
      <nav>
        <ng-container *ngIf="subjects$ | async as subjectLists">
          <header>subject</header>
          <ul>
            <ng-container *ngFor="let item of subjectLists">
              <li (click)="loadLesson(item.id)" [class.active]="selectedSubject == item.id">
                <a >
                  <span>{{ item.title }}</span>
                </a>
              </li>
            </ng-container>
          </ul>
        </ng-container>
        <ng-container *ngIf="(lessons$ | async) as lessonLists">
          <header>Lesson</header>
          <ul>
            <ng-container *ngFor="let item of lessonLists">
              <li (click)="loadContent(item.id)" [class.active]="selectedLesson == item.id">
                <span>{{ item.title }}</span>
              </li>
            </ng-container>
          </ul>
        </ng-container>
        <ng-container *ngIf="contents$ | async as contentList">
          <header>Content</header>
          <ul>
            <ng-container *ngFor="let item of contentList" >
              <li (click)="loadExercise(item.id)" [class.active]="selectedContent == item.id">
                <span>{{ item.title }}</span>
              </li>
            </ng-container>
          </ul>
        </ng-container>
      </nav>
    </section>
  `,
  styles: [`

  .menu-container {
    @apply flex flex-col ;
}

.menu-container > header {
    @apply border-solid border-[1px] border-green-500  bg-gray-900  text-white;
    @apply  text-[32px] leading-[38px] text-center font-light capitalize py-3;
}
.menu-container > nav {
    @apply p-4 border-solid border-[1px] border-green-500 bg-gray-900;

    height: calc(100vh - 62px);

}
.menu-container > nav > header {
    @apply  text-[14px] font-bold text-green-500 capitalize;
}
.menu-container > nav > ul {
    @apply flex flex-col gap-2 px-2 text-[20px];
}
.menu-container > nav > ul > li {
    @apply px-2 py-1 rounded-md;
}
.menu-container > nav > ul > li > a {
    @apply text-[#fff];
}

.menu-container > nav > ul > li.active  {
    @apply bg-green-600 transition-all duration-300;
}
.menu-container > nav > ul > li:hover {
    @apply bg-green-400  transition-all duration-300 cursor-pointer;
}
  `],
})
export class SidemenuComponent implements OnInit{

  @Input() header = 'store';
  storeList: any[] = [];
  branchList: any[] = [];
  categorteList: any[] = [];

  subjects$?: Observable<any[]>
  lessons$?: Observable<any[]>
  contents$?: Observable<any[]>
  exerices$?: Observable<any[]>

  selectedSubject = ''
  selectedLesson = ''
  selectedContent = ''

  constructor(private dashSrv: DashboardService, private router: Router) {


  }
  ngOnInit(): void {
    // this.stores$ = this.dashSrv.getStores()
    this.router.events.subscribe((v: any) => {
      console.log(v)
      if(v instanceof NavigationEnd ) {

        if(!v.url.includes('subject')) {
          this.subjects$ = this.dashSrv.getSubjects();
        }
        if(!v.url.includes('subject') || !v.url.includes('lesson')) {

        }
        if(!v.url.includes('subject') || !v.url.includes('lesson') || !v.url.includes('content')) {

        }
      }
    })


  }
  loadLesson(subjectId: string) {
    this.selectedSubject =subjectId;
    this.selectedLesson = '';
    this.selectedContent = '';
    if(this.header == 'lesson' ) {
      this.lessons$ = of([])
      this.dashSrv.loadLessons({subject_id: subjectId})
    }
    else {
      this.lessons$ = this.dashSrv.getLessons({subject_id: subjectId})
    }
  }
  loadContent(lesson_id: string) {
    this.selectedLesson = lesson_id;
    this.selectedContent = '';
    if(this.header == 'content' ) {
      this.contents$ = of([])
      this.dashSrv.loadContent({lesson_id})
    }
    else {
      this.contents$ = this.dashSrv.getContent({lesson_id})
    }
  }
  loadExercise(content_id: string) {
    this.selectedContent = content_id;
    if(this.header == 'exerices' ) {
      this.exerices$ = of([])
      this.dashSrv.loadExercise({content_id})
    }
    else {
      this.exerices$ = this.dashSrv.getExercise({content_id})
    }
  }
}
