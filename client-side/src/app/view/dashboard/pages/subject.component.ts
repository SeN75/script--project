import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TableDataField, TableAcion } from '../components/table.component';
import { DashboardService } from '../dashboard.service';
import { map } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-subject',
  template: `


<section class="dashboard-content">
  <section>
    <button mat-raised-button color="primary" (click)="openSideContainer()">
      Add
    </button>
  </section>
  <dash-table [dataSource]="dataSource" [tabelActions]="dataTableActions" [coulmus]="dataTabelColumns"
    [data]="dataTabelFiels"></dash-table>
</section>

<side-container [settings]="settings" >
  <form [formGroup]='form' class="form">
  <mat-form-field>
      <mat-label>title</mat-label>
      <input matInput formControlName="title">
      <!-- <mat-error *ngFor="let error of keys(controls['name_ar'].errors)">
      </mat-error> -->
    </mat-form-field>
  <mat-form-field>
      <mat-label>level</mat-label>
      <input matInput formControlName="level">
      <!-- <mat-error *ngFor="let error of keys(controls['name_ar'].errors)">
      </mat-error> -->
    </mat-form-field>
  <mat-form-field>
      <mat-label>language</mat-label>
      <input matInput formControlName="language">
      <!-- <mat-error *ngFor="let error of keys(controls['name_ar'].errors)">
      </mat-error> -->
    </mat-form-field>
    <div class="action">
      <button mat-raised-button color="primary" (click)="action()" [disabled]="form.invalid">{{settings.action}}</button>
      <button mat-button (click)="settings.isOpen = false" >cancel</button>
    </div>
  </form>
</side-container>

  `,
  styles: [`

  `]
})
export class SubjectComponent {
  settings = { isOpen: false, title: 'Add new Company', action: 'add' };
  form = new FormGroup({
      title: new FormControl<string>('', [Validators.required]),
      level: new FormControl<number>(0, [Validators.required]),
      language: new FormControl<string>('', [Validators.required]),
  })
  slectedId = ''

  dataSource = new MatTableDataSource<Subject>();
  dataTabelFiels: TableDataField[] = [];
  dataTabelColumns: string[] = [];
  dataTableActions: TableAcion[] = [];
  constructor(private dashSrv: DashboardService) {

  }
  ngOnInit(): void {
    this.setTable();
    this.dashSrv.loadSubjects()
    this.dashSrv.subjects$.pipe(map(data => data.map((d,i) => ({...d, pos: i+1})))).subscribe(data => this.dataSource.data = data)
  }

  setTable() {
    this.dataTabelFiels = [
      { title: '#', type: 'text', label: 'pos', value: 'pos' },
      { title: 'title', type: 'text', label: 'title', value: 'title' },
      {
        title: 'language',
        type: 'text',
        label: 'language',
        value: 'language',
      },
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
        color: 'warn',
        action: (index: number) => {
          // delete action
        }
      }
    ]
  }
  action() {

  }
  openSideContainer(type = 'add', data?: Subject) {
    this.settings.isOpen = true;
    if (type == 'add') {
      this.settings.title = 'Add new Subject';
      this.form.reset();
      this.settings.action = 'add';
    } else {
      this.settings.title = 'Edit Subject';
      this.slectedId = data?.id!;
      this.form.patchValue(data || {});
      this.settings.action = 'edit';
    }
  }

}



export interface Subject {
  title: string,
  level: number,
  language: string,
  id: string,
}


