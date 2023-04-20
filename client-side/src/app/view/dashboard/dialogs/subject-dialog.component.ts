import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from '../pages/subject.component';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'subject-dialog',
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
        <mat-form-field>

          <mat-label>اللغة</mat-label>
          <mat-select formControlName="language" >
            <mat-option value="javascript">javascript</mat-option>
          </mat-select>
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
  `],
})
export class SubjectDialogComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl<string>('', [Validators.required]),
    level: new FormControl<number>(0, [Validators.required]),
    language: new FormControl<string>('', [Validators.required]),
    id: new FormControl(),
  });

  constructor(
    public dialogRef: MatDialogRef<SubjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { status: 'add' | 'edit'; subject: Subject },
    private dashSrv: DashboardService
  ) {}
  ngOnInit(): void {
    if (this.data.subject) {
      this.form.patchValue(this.data.subject);
    }
  }
  close() {
    this.dialogRef.close()
  }
  action() {
    const {value} = this.form
    if (this.data.status == 'add') {
      this.dashSrv.addSubject(value as Subject).then(success => {
        if(success)
          this.dialogRef.close('load')
      })
    } else {
      this.dashSrv.updateSubject(value as Subject).then(success => {
        if(success)
          this.dialogRef.close('load')
      })
    }
  }
}
