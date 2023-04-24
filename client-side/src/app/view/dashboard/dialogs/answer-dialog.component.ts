import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";



@Component({
  selector: 'anwser-dialog',
  template: `
  <div mat-dialog-title>

  <button mat-icon-button (click)="close()">
    <mat-icon>close</mat-icon>
  </button>
</div>
    <mat-dialog-content>
        <div class="message">
        {{data.message}}
        </div>
        <p>{{data.text}}</p>

      <mat-dialog-actions>
        <button mat-raised-button color="primary" *ngIf="data.actionName" (click)="action()">{{data.actionName || 'استمرار'}}</button>
        <button mat-raised-button (click)="close()" >{{'اغلاق'}}</button>
      </mat-dialog-actions>
    </mat-dialog-content>
  `,
  styles: [`
  mat-dialog-content {
    @apply flex flex-col gap-6 font-f1 text-white leading-[1];
    & div.message {
      @apply text-center font-bold text-[28px] leading-[1];
    }
    & p {
      @apply text-center font-normal text-[22px] leading-[1];
    }
    & mat-dialog-actions {
      @apply flex justify-center gap-6;
    }
  }
  `]
})

export class AnswerDialogComponent {

  constructor(    public dialogRef: MatDialogRef<AnswerDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data:{
      message: string,
      text: string,
      actionName?: string,
      action?: () => any
    },){

    }
  close() {
    this.dialogRef.close()
  }
  action() {
    if(!this.data.action)
    this.close();
    else
      this.data.action();
  }
}
