import { Component } from '@angular/core';
import { DashboardService } from './../../dashboard.service';
import { Observable } from 'rxjs';
import { Content } from '../../pages/content.component';

@Component({
  selector: 'tab-of-content',
  templateUrl: './tab-of-content.component.html',
  styleUrls: ['./tab-of-content.component.scss']
})
export class TabOfContentComponent {
  contents$: Observable<Content[] | null>

  constructor(private  dashSrv:DashboardService) {

  this.contents$ = this.dashSrv.currentContents$;

  }
}
