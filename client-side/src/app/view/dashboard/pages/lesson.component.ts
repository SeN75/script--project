import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, map } from 'rxjs';
import { TableDataField, TableAcion } from '../components/table.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-lesson',
  template: `

<section class="dashboard-content">
  <section>
    <button mat-raised-button color="primary">
      Add +
    </button>
  </section>
  <dash-table [dataSource]="dataSource" [tabelActions]="dataTableActions" [coulmus]="dataTabelColumns"
    [data]="dataTabelFiels"></dash-table>
</section>
  `,
  styles: [`
  `]
})
export class LessonComponent {

  dataSource = new MatTableDataSource<Lesson>();
  dataTabelFiels: TableDataField[] = [];
  dataTabelColumns: string[] = [];
  dataTableActions: TableAcion[] = [];
  constructor(private dashSrv: DashboardService) {

  }
  ngOnInit(): void {
    this.setTable();
    this.dashSrv.lessons$.pipe(map(data => data.map((d,i) => ({...d, pos: i+1})))).subscribe(data => this.dataSource.data  = data)
  }

  setTable() {
    this.dataTabelFiels = [
      { title: '#', type: 'text', label: 'pos', value: 'pos' },
      { title: 'title', type: 'text', label: 'title', value: 'title' },

      {
        title: 'level',
        type: 'text',
        label: 'level',
        value: 'level',
      },
      { title: '', type: 'actions', label: 'actions', value: 'actions' },
    ];
    this.dataTabelColumns = this.dataTabelFiels.map((e) => e.label);

    this.dataTableActions = [
      {
        icon: 'edit',
        label: 'edit branch',
        color: '',
        action: (index: number) => {
          // edit action
        }
      },
      {
        icon: 'delete',
        'label': 'delete branch',
        color: '',
        action: (index: number) => {
          // delete action
        }
      }
    ]
  }

}



export interface Lesson {
  title: string,
  level: number,
  status:boolean,
  subject_id:string,
  subject_name:string,
  id: string,
}



