import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { IconService } from 'src/app/services/icon.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isSubject = false;
  page = 'subject'
  constructor(
    private router: Router,
    private iconSrv: IconService
  ) { }

  ngOnInit(): void {

  }

}
