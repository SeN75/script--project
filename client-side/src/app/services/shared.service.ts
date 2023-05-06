import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  toggleSidenav = new BehaviorSubject<boolean> (false);
  get toggleSidenav$ () {return this.toggleSidenav.asObservable()}
  constructor() { }
}
