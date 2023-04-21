import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first, Observable, of } from 'rxjs';
import { Subject } from './pages/subject.component';
import { Lesson } from './pages/lesson.component';
import { Content } from './pages/content.component';
import { Exercise } from './pages/exerices.component';
import { API } from 'src/app/common/api.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from 'src/app/services/logger.service';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
 private subjects = new BehaviorSubject<Subject[]>([])
 private lessons = new BehaviorSubject<Lesson[]>([])
 private contents = new BehaviorSubject<Content[]>([])
 private exrcises = new BehaviorSubject<Exercise[]>([])

 get subjects$() {return this.subjects.asObservable()}
 get lessons$() {return this.lessons.asObservable()}
 get contents$() {return this.contents.asObservable()}
 get exrcises$() {return this.exrcises.asObservable()}

 currentSubject?: Subject;

 currentLesson = new BehaviorSubject<Lesson | null> (null);
 get currentLesson$() {return this.currentLesson.asObservable()}

 currentContents = new BehaviorSubject<Content[] | null> (null);
 get currentContents$() {return this.currentContents.asObservable()}

  constructor(private http: HttpClient, private toaster: MatSnackBar, private logger: LoggerService, private router: Router, private actvatedRoute: ActivatedRoute) {
    this.currentLesson.subscribe((v) => {
      if(v)
        this.getContentByLessonId(v.id!).subscribe((data) => {
          this.currentContents.next(data)
        })
    })
   }
  setCurrentSubject(subject: Subject, lesson?: number) {
    this.currentSubject = {...subject};
    if(this.currentSubject.Lesson?.length) {
      this.setCurrentLesson(this.currentSubject.Lesson[0], {subjectId: subject.id!, lesson: lesson || 0})
      this.lessons.next(this.currentSubject.Lesson)
    }

    // this.router.navigate(['dashboard', 'admin', subject.id,{lesson: 0}])

  }
  setCurrentLesson(data: Lesson, {subjectId, lesson}:{subjectId: string, lesson:number} ) {
    this.currentLesson.next( {...data});
    this.router.navigate(['dashboard', 'admin', subjectId,{lesson}])

  }
// ====================================
// ============= Subject ==============
// ====================================
  getSubjects(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Subject[]>(`${API}/subject${query}`)
  }
  getSubjectById(id: string) {
    return this.http.get<Subject>(`${API}/subject?id=${id}`)
  }
  loadSubjects() {
    this.getSubjects().subscribe(v => this.subjects.next(v))
  }
  addSubject(subject:Subject) {
    const data = {...subject}
    delete data.id;
   return this.http.post<Subject>(`${API}/subject`, {...data,level: +data.level}).pipe(first()).toPromise().then(success => {
      this.alert('Create new Subject was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('create new Subject ==> ', error)
      this.alert('An Error happend while Create new Subject', false)
    })
  }

  updateSubject(subject:Subject) {
    const data = {...subject}
    const id = data.id
    delete data.id;
   return this.http.patch<Subject>(`${API}/subject?id=${id}`, {...data,level: +data.level}).pipe(first()).toPromise().then(success => {
      this.alert('Update Subject was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Update Subject ==> ', error)
      this.alert('An Error happend while Update Subject', false)
    })
  }
  updateCurrentSubject(index?: number) {
   this.getSubjectById(this.currentSubject?.id!).pipe(first()).subscribe(data => {
    this.setCurrentSubject(data, index)
   })
  }
  deleteSubject(id: string) {
   return this.http.delete<Subject>(`${API}/subject?id=${id}`).pipe(first()).toPromise().then(success => {
      this.alert('Delete Subject was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Delete Subject ==> ', error)
      this.alert('An Error happend while Delete Subject', false)
    })
  }
// ====================================
// ============== Lesson ==============
// ====================================
  getLessons(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Lesson[]>(`${API}/lesson${query}`)
  }
  getLessonById(id: string) {
    return this.http.get<Lesson>(`${API}/lesson?id=${id}`)
  }
  getPageContentByLessonId(id: string) {
    return this.http.get<Lesson>(`${API}/loadData?load=getPageContentByLessonId&lessonId=${id}`)
  }
  loadLessons(query: any  = '') {
    this.getLessons(query).subscribe(v => this.lessons.next(v))
  }

  addLesson(lesson: Lesson) {
    const data = {...lesson}
    delete data.id;
   return this.http.post<Lesson>(`${API}/lesson`, {...data,level: +data.level}).pipe(first()).toPromise().then(success => {
      this.alert('Create new Lesson was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('create new Lesson ==> ', error)
      this.alert('An Error happend while Create new Lesson', false)
    })
  }
  updateLesson(lesson:Lesson) {
    const data = {...lesson}
    const id = data.id
    delete data.id;
   return this.http.put<Lesson>(`${API}/lesson?id=${id}`, {...data,level: +data.level}).pipe(first()).toPromise().then(success => {
      this.alert('Update Lesson was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Update Lesson ==> ', error)
      this.alert('An Error happend while Update Lesson', false)
    })
  }
  deleletLesson(id: string) {
   return this.http.delete<Lesson>(`${API}/lesson?id=${id}`).pipe(first()).toPromise().then(success => {
      this.alert('Delete Lesson was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Delete Lesson ==> ', error)
      this.alert('An Error happend while Delete Lesson', false)
    })
  }
// ====================================
// ============== Content =============
// ====================================
  getContent(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Content[]>(`${API}/content${query}`)
  }
  loadContent(query: any  = '') {
    this.getContent(query).subscribe(v => this.contents.next(v))
  }
  getContentByLessonId(lesson_id: string) {
    return this.http.get<Content[]>(`${API}/content?lesson_id=${lesson_id}&exercise=true`)
  }

  addContent(content: Content) {
    const data = {...content}
    delete data.id;
   return this.http.post<Content>(`${API}/content`, {...data,level: +data.level}).pipe(first()).toPromise().then(success => {
      this.alert('Create new content was Successfully', true)

      return success
    }).catch(error => {
      this.logger.error('create new content ==> ', error)
      this.alert('An Error happend while Create new content', false)
    })
  }
  updateContent(content:Content) {
    const data = {...content}
    const id = data.id
    delete data.id;
   return this.http.put<Content>(`${API}/content?id=${id}`, {...data,level: +data.level}).pipe(first()).toPromise().then(success => {
      this.alert('Update content was Successfully', true)

      return success
    }).catch(error => {
      this.logger.error('Update content ==> ', error)
      this.alert('An Error happend while Update content', false)
    })
  }
  deleletContent(id: string) {
   return this.http.delete<Content>(`${API}/content?id=${id}`).pipe(first()).toPromise().then(success => {
      this.alert('Delete content was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Delete content ==> ', error)
      this.alert('An Error happend while Delete content', false)
    })
  }

// ====================================
// ============= Exercise =============
// ====================================
  getExercise(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Exercise[]>(`${API}/exercise${query}`)
  }

  addExercise(exercise: Exercise) {
    const data = {...exercise}
    delete data.id;
   return this.http.post<Exercise>(`${API}/exercise`, {...data,level: +data.level, answers: data.answers.join(';'),point:+data.point}).pipe(first()).toPromise().then(success => {
      this.alert('Create new exercise was Successfully', true)

      return success
    }).catch(error => {
      this.logger.error('create new exercise ==> ', error)
      this.alert('An Error happend while Create new exercise', false)
    })
  }
  updateExercies(exercise:Exercise) {
    const data = {...exercise}
    const id = data.id
    delete data.id;

   return this.http.put<Exercise>(`${API}/exercise?id=${id}`, {...data,level: +data.level, answers: data.answers.join(';'), point:+data.point}).pipe(first()).toPromise().then(success => {
      this.alert('Update exercise was Successfully', true)

      return success
    }).catch(error => {
      this.logger.error('Update exercise ==> ', error)
      this.alert('An Error happend while Update exercise', false)
    })
  }
  deleletExercies(id: string) {
   return this.http.delete<Exercise>(`${API}/exercise?id=${id}`).pipe(first()).toPromise().then(success => {
      this.alert('Delete exercise was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Delete exercise ==> ', error)
      this.alert('An Error happend while Delete exercise', false)
    })
  }

  loadExercise(query: any  = '') {
    this.getExercise(query).subscribe(v => this.exrcises.next(v))
  }
  alert(message: string, isSuccess: boolean) {
    this.toaster.open(message, undefined, {
      panelClass: isSuccess ? 'success-msg' : 'error-msg',
      duration: 5000,
    })
  }
}
