import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataField, TableAcion } from '../components/table.component';
import { DashboardService } from '../dashboard.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-exerices',
  template: `
    <section class="dashboard-content">
      <section>
        <button mat-raised-button color="primary">Add +</button>
      </section>
      <dash-table
        [dataSource]="dataSource"
        [tabelActions]="dataTableActions"
        [coulmus]="dataTabelColumns"
        [data]="dataTabelFiels"
      ></dash-table>
    </section>
  `,
  styles: [``],
})
export class ExericesComponent {
  dataSource = new MatTableDataSource<Exercise>();
  dataTabelFiels: TableDataField[] = [];
  dataTabelColumns: string[] = [];
  dataTableActions: TableAcion[] = [];
  constructor(private dashSrv: DashboardService) {

  }
  ngOnInit(): void {
    this.setTable();
    this.dashSrv.exrcises$.pipe(map(data => data.map((d,i) => ({...d, pos: i+1})))).subscribe(data => this.dataSource.data  = data)

  }

  setTable() {
    this.dataTabelFiels = [
      { title: '#', type: 'text', label: 'pos', value: 'pos' },
      { title: 'header', type: 'text', label: 'header', value: 'header' },

      {
        title: 'level',
        type: 'text',
        label: 'level',
        value: 'level',
      },
      { title: 'point', type: 'text', label: 'point', value: 'point' },
      { title: 'answers', type: 'array', label: 'answers', value: 'answers' },
      { title: 'description', type: 'text', label: 'description', value: 'description' },
      { title: '', type: 'actions', label: 'actions', value: 'actions' },
    ];
    this.dataTabelColumns = this.dataTabelFiels.map((e) => e.label);

    this.dataTableActions = [
      {
        icon: 'code',
        label: 'code branch',
        color: '',
        action: (index: number) => {
          // edit action
        },
      },
      {
        icon: 'edit',
        label: 'edit branch',
        color: '',
        action: (index: number) => {
          // edit action
        },
      },
      {
        icon: 'delete',
        label: 'delete branch',
        color: '',
        action: (index: number) => {
          // delete action
        },
      },
    ];
  }
}

export interface Exercise {
  level: number;
  status: boolean;
  id: string;
  code: string;
  content_id: string;
  point: number;
  answers: string[];
  header?: string,
  description?: string,
}
