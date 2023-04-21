import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Subject } from "./pages/subject.component";
import { SubjectDialogComponent } from "./dialogs/subject-dialog.component";
import { MessageDialogComponent } from "./dialogs/message-dialog.component";
import { Lesson } from "./pages/lesson.component";
import { LessonDialogComponent } from "./dialogs/lesson-dialog.component";



@Injectable({
  providedIn: 'root'

})

export class DashDialogSrvice {
  constructor(private dialog: MatDialog) {}


  subject(status: 'add' | 'edit' = 'add', subject?: Subject) {
    const dialogRef = this.dialog.open(SubjectDialogComponent, {
      maxHeight: '90%',
      maxWidth: '90%',
      minWidth: '300px',
      data: {status, subject}
    })

    return dialogRef;
  }

  lesson(status: 'add' | 'edit' = 'add', subject_id: string,lesson?: Lesson) {
    const dialogRef = this.dialog.open(LessonDialogComponent, {
      maxHeight: '90%',
      maxWidth: '90%',
      minWidth: '300px',
      data: {status, subject_id,lesson}
    })

    return dialogRef;
  }
  message(
    title: string,
    message: string,
    callback?: Function,
    state?: string,
    text?: string
  ) {
    const dialogRef = this.dialog.open(MessageDialogComponent, {
      maxHeight: '98%',
      maxWidth: '98%',
      minWidth: '360px',
      data: { title, message, callback, state, text },
    });

    return dialogRef;
  }
}
