import { Component, OnInit } from '@angular/core';
import { DashboardService } from './../../dashboard.service';
import { Observable,  } from 'rxjs';
import { Subject } from '../subject.component';
import { NavigationEnd, Router } from '@angular/router';
import { DashDialogSrvice } from '../../dialog.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  showFiller = false;
  subjects$?: Observable<Subject[]>
  isAdmin = true;
  isEdit = true;
  user = {
    email: 'admin@script-project.com',
    name: 'admin script'
  }
  activePath = ''
  constructor(private dashSrv: DashboardService,
    private dashDialog: DashDialogSrvice,
    private router: Router) {

  }
  ngOnInit(): void {
    this.subjects$ = this.dashSrv.getSubjects();
    this.activePath = this.router.url.replace(/\/dashboard\/admin\//g, '')
    this.router.events.subscribe(v => {
      if(v instanceof NavigationEnd)
        this.activePath = this.router.url.replace(/\/dashboard\/admin\//g, '')
    })
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

}
