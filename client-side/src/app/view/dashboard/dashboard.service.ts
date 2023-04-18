import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from './pages/subject.component';
import { Lesson } from './pages/lesson.component';
import { Content } from './pages/content.component';
import { Exercise } from './pages/exerices.component';
import { API } from 'src/app/common/api.config';

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

  constructor(private http: HttpClient) { }

  getSubjects(query: any  = '') {
    if(typeof query == 'object') {
      query = Object.keys(query).map((key, i )=> i == 0 ?`?${key}=${query[key]}` : `&${key}=${query[key]}`).reduce((a,b) => a+b)
    }
    return this.http.get<Subject[]>(`${API}/subject${query}`)
  }
  loadSubjects() {
    this.getSubjects().subscribe(v => this.subjects.next(v))
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
}
