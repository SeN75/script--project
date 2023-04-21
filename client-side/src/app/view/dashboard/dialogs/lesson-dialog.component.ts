import { Component, Inject } from "@angular/core";
import { Lesson } from "../pages/lesson.component";
import { DashboardService } from "../dashboard.service";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'lesson-dialog',
  template: `
  <div mat-dialog-title>
  <span class="title">
  {{ data.status == 'add' ? 'اضافة' : 'تعديل' }} درس
  </span>
  <button mat-icon-button (click)="close()">
    <mat-icon>close</mat-icon>
  </button>
</div>
    <mat-dialog-content>
      <form [formGroup]="form">

        <mat-form-field>
          <mat-label>عنوان</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>
        <mat-form-field>

          <mat-label>مستوى</mat-label>
          <input matInput formControlName="level" />
        </mat-form-field>


      </form>
      <mat-dialog-actions>
        <button mat-raised-button (click)="action()" color="primary">
        {{ data.status == 'add' ? 'اضافة' : 'تعديل' }}
        </button>
        <button mat-dialog-close color="warn">الغاء</button>
      </mat-dialog-actions>
    </mat-dialog-content>

  `,
  styles: [`

form {
      @apply flex flex-col gap-4;
    }
    mat-dialog-actions {
      @apply flex gap-2;
    }
  `]
})

export class LessonDialogComponent {
  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    level: new FormControl<number>(0, [Validators.required])
  })
  constructor( public dialogRef: MatDialogRef<LessonDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { status: 'add' | 'edit'; lesson: Lesson, subject_id: string },
    private dashSrv: DashboardService) {

    }

    close() {

    }
    action() {
      const {value} = this.form
      if(this.data.status == 'add') {
        this.dashSrv.addLesson({...value, subject_id: this.data.subject_id} as Lesson).then(success => {
          if(success)
            this.dialogRef.close('load')
        })
      }
      else {

      }
    }
}
