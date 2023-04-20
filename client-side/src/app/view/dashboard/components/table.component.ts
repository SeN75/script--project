import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../dashboard.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'dash-table',
  template: `
    <section class="">
      <table mat-table [dataSource]="dataSource" matSort>
        <!-- Symbol Column -->
        <ng-container [matColumnDef]="d.label" *ngFor="let d of data">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>
            <span>{{ d.title }}</span>
          </th>

          <td mat-cell *matCellDef="let element; index as i">
            <span [ngSwitch]="d.type">
              <span *ngSwitchCase="'text'">
                {{ element[d.value] }}
              </span>
              <span *ngSwitchCase="'pic'">
                <picture>
                  <img [src]="element[d.value]" />
                </picture>
              </span>
              <span *ngSwitchCase="'array'">
                <span *ngFor="let item of element[d.value]">{{
                  item.name
                }}</span>
              </span>
              <span *ngSwitchCase="'date'">
              {{ element[d.value]  | date:'MM/dd/yyyy'}}
              </span>

              <span *ngSwitchCase="'actions'">
                <button
                  mat-icon-button
                  *ngFor="let action of tabelActions"
                  (click)="action.action(i)"
                  [color]="action.color"
                >
                  <mat-icon >{{ action.icon }}</mat-icon>
                </button>
              </span>
            </span>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="coulmus"></tr>
        <tr mat-row *matRowDef="let row; columns: coulmus"></tr>
      </table>

      <mat-paginator
        [pageSizeOptions]="[5,10,15,20]"
        aria-label="Select page of periodic elements"
      >
      </mat-paginator>
    </section>
  `,
  styles: [
    `
      table {
        @apply w-full;

        & th {
          @apply text-[16px] bg-[#0b0f17] text-white;
        }
        & td {
          @apply text-[18px] bg-[#0b0f17] text-white;
        }
      }
      picture {
        @apply w-[50px] h-[50px] block;
        & img {
          @apply w-full h-full  object-cover;
        }
      }
      section {
        @apply max-h-[60vh] w-full min-h-[30vh] overflow-y-auto flex flex-col bg-[#0b0f17];
        @apply border-solid border-[1px];
        & mat-paginator {
          @apply mt-auto  bg-[#0b0f17] text-white;

        }
        border-radius: 4px;

      }
      div {

      }
    `,
  ],
})
export class TableComponent implements OnInit{
  @Input() dataSource!: MatTableDataSource<any>;
  @Input() coulmus!: string[];
  @Input() data: TableDataField[] = [];
  @Input() tabelActions: TableAcion[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() pageChange = new EventEmitter();
  constructor(private dashSrv:DashboardService, private logger: LoggerService) {

  }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(v => this.pageChange.emit(v))
    // this.dashSrv.paginator$.subscribe(v => {
    //   setTimeout(() => {
    //     if(this.paginator.length != v.totalRecord) {
    //       this.paginator.length = v.totalRecord;
    //     }
    //   }, 1000)
    // })
  }
}
export interface TableDataField {
  label: string;
  title: string;
  value: string;
  type: 'text' | 'actions' | 'pic' | 'array' | 'date';
}

export interface TableAcion {
  label: string;
  icon: string;
  action: Function;
  color: string
}
