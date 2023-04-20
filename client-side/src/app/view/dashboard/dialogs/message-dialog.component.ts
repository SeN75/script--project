import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-message-dialog',
  template: `
  <div mat-dialog-title>


<div>
  <span class="title">
    {{ data.title}}
  </span>
  <button mat-icon-button (click)="close()">
    <mat-icon>close</mat-icon>
  </button>
</div>

</div>
<mat-dialog-content>
<p>
  {{data.message}}
</p>
</mat-dialog-content>


<mat-dialog-actions class="action">
<button *ngIf="data.state" mat-raised-button (click)="action()"
  color="{{data.state == 'add'? 'primary' : data.state == 'delete' ? 'warn' : ''}}">{{(data.text ||
  data.state)}}</button>

<button mat-button (click)="close()">
  {{'close'}}
</button>
</mat-dialog-actions>


  `,
  styles: ['']
})
export class MessageDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
  ) { }

  ngOnInit(): void {
  }
  close() {
    this.dialogRef.close()
  }
  action() {
    this.data.callback();
    this.close();
  }
}
