import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, first } from 'rxjs';
import { Subject } from './pages/subject.component';
import { Lesson } from './pages/lesson.component';
import { Content } from './pages/content.component';
import { Exercise } from './pages/exerices.component';
import { API } from 'src/app/common/api.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from 'src/app/services/logger.service';

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

  constructor(private http: HttpClient, private toaster: MatSnackBar, private logger: LoggerService) { }
// ====================================
// ============= Subject ==============
// ====================================
  getSubjects(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Subject[]>(`${API}/subject${query}`)
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
  deleteSubject(id: string) {
   return this.http.delete<Subject>(`${API}/subject?id=${id}`).pipe(first()).toPromise().then(success => {
      this.alert('Delete Subject was Successfully', true)

      return true
    }).catch(error => {
      this.logger.error('Delete Subject ==> ', error)
      this.alert('An Error happend while Delete Subject', false)
    })
  }

  getLessons(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Lesson[]>(`${API}/lesson${query}`)
  }
  loadLessons(query: any  = '') {
    this.getLessons(query).subscribe(v => this.lessons.next(v))
  }
  getContent(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Content[]>(`${API}/content${query}`)
  }
  loadContent(query: any  = '') {
    this.getContent(query).subscribe(v => this.contents.next(v))
  }
  getExercise(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Exercise[]>(`${API}/exercise${query}`)
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
