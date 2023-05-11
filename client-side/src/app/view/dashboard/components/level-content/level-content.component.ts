import { Component, Input, OnInit } from '@angular/core';
import { Observable, map, of, first, tap } from 'rxjs';
import { Lesson } from '../../pages/lesson.component';
import { DashboardService } from '../../dashboard.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Content } from '../../pages/content.component';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoggerService } from 'src/app/services/logger.service';
import { DashDialogSrvice } from '../../dialog.service';

@Component({
  selector: 'level-content',
  templateUrl: './level-content.component.html',
  styleUrls: ['./level-content.component.scss'],
})
export class LevelContentComponent implements OnInit {
  lessons: Lesson[] = [];
  @Input() lesson?: Lesson;
  @Input() isEdit = true;
  lesson$?: Observable<Lesson | null>;
  contents$?: Observable<Content[] | null>;

  lessonTitleCtrl = new FormControl<string>('', [Validators.required]);
  contentsForms = new FormArray<
    FormGroup<{
      title: FormControl<string>;
      id: FormControl<string>;
      level: FormControl<number>;
      description: FormControl<string>;
      subtitle?: FormControl<string>;
      subdescription?: FormControl<string>;
      exercises: FormArray<
        FormGroup<{
          level: FormControl<number>;
          id: FormControl<string>;
          code: FormControl<string>;
          point: FormControl<number>;
          answers: FormArray<FormControl<string>>;
          header?: FormControl<number>;
          description?: FormControl<number>;
        }>
      >;
    }>
  >([]);

  constructor(
    public dashSrv: DashboardService,
    private actvatedRoute: ActivatedRoute,
    private router: Router,
    private logger: LoggerService,
    private dialogSrv: DashDialogSrvice
  ) {}
  ngOnInit(): void {
    this.loadData();
    this.router.events.subscribe((v) => {});
  }
  loadData() {
    const lesson_id = (this.actvatedRoute.snapshot.paramMap.get('lesson') ||
      -1) as number;
    this.lesson$ = this.dashSrv.currentLesson$;
    this.contents$ = this.dashSrv.currentContents$;
    this.contents$
      .pipe(tap(() => (this.contentsForms = new FormArray<FormGroup>([]))))
      .subscribe((contents) => {
        this.contentsForms.setValue([]);
        console.log('contentsForms  ==> ', this.contentsForms);
        const group = contents?.map((content) => ({
          title: content.title,
          id: content.id,
          level: content.level,
          description: content.description,
          subtitle: content.subtitle,
          subdescription: content.subdescription,
          exercises: content.exercises,
        }));
        this.logger.log('group ==> ', group)
        group?.forEach((g) => {
          const exercises: any = g.exercises?.map((e) => {
            return  new FormGroup({
              level: new FormControl(e.level),
              id: new FormControl(e.id),
              code: new FormControl(e.code),
              point: new FormControl(e.point),
              header: new FormControl(e.header),
              description: new FormControl(e.description),
              answers: new FormArray(
                e.answers ? e.answers?.map((a) => new FormControl<string>(a)) : []
              ),
            });
          });
          const form = new FormGroup({
            title: new FormControl(g.title),
            description: new FormControl(g.description + ''),
            id: new FormControl(g.id + ''),
            level: new FormControl(g.level || 0),
            subdescription: new FormControl(g.subdescription),
            subtitle: new FormControl(g.subtitle),
            exercises: new FormArray(exercises),
          });
          this.contentsForms.push(form as any);
          this.logger.log('exercises ==< ', form.controls.exercises);
        });
        this.logger.log('contentForm ==< ', group);
        this.logger.log('contentForm ==< ', this.contentsForms.controls);
      });
    this.lesson$.subscribe((lesson) => {
      if (lesson) this.lessonTitleCtrl.setValue(lesson.title);
    });
    // if(lesson_id) {
    //   this.lesson$ = this.dashSrv.getLessonById(lesson_id)
    // }
  }
  updateLesson(lesson: Lesson, field: string) {
    this.logger.log('', lesson);
    let value = { ...lesson };
    if (field == 'title') value.title = this.lessonTitleCtrl.value!;
    this.dashSrv.updateLesson(value);
  }
  // ===============================
  // ========== content ============
  // ===============================
  addContent() {
    this.contentsForms.push(
      new FormGroup({
        description: new FormControl(''),
        id: new FormControl(''),
        title: new FormControl(''),
        subdescription: new FormControl(''),
        subtitle: new FormControl(''),
        exercises: new FormArray([]),
        level: new FormControl(0),
      }) as any
    );
  }
  async contentAction(index: number) {
    const lesson_id = (await this.lesson$?.pipe(first()).toPromise())?.id;
    const value: any = this.contentsForms.controls[index].value;
    value.lesson_id = lesson_id;
    delete value.exercises;
    if (!value.id)
      this.dashSrv.addContent(value as Content).then((success) => {
        if (success)
          this.contentsForms.controls[index].patchValue(success as any);
      });
    else
      this.dashSrv.updateContent(value as Content).then((success) => {
        if (success)
          this.contentsForms.controls[index].patchValue(success as any);
      });
  }
  removeContent(index: number) {
    this.dialogSrv.message(
      'حذف محتوى',
      'هل تريد حقا حذف هذا المحتوى؟',
      () => {
        const value: any = this.contentsForms.controls[index].value;
        if(value.id) {
          this.dashSrv.deleletContent(value.id).then((res) => {
            if(res)
              this.contentsForms.removeAt(index);
          })
        }
        else
        this.contentsForms.removeAt(index);

      },
      'delete'
    );
  }

  // ===============================
  // ========== exercise ===========
  // ===============================
  addExericse(contentIndex: number) {
    this.contentsForms.controls[contentIndex].controls.exercises.push(
      new FormGroup({
        answers: new FormArray([]),
        code: new FormControl(''),
        id: new FormControl(),
        level: new FormControl<number>(0),
        point: new FormControl<number>(0),
        description: new FormControl<string>(''),
        header: new FormControl<string>(''),
      }) as any
    );
  }
  exericseAction(contentIndex: number, index: number) {
    const content = this.contentsForms.controls[contentIndex]
    const value: any =
      content.controls['exercises'].controls[
        index
      ].value;
    if (!value.id) {
      value.content_id = content.value.id
      this.dashSrv.addExercise(value).then((success) => {
        if (success)
          this.contentsForms.controls[contentIndex].controls[
            'exercises'
          ].controls[index].patchValue(success as any);
      });
      this.logger.log(
        'content value - add -',
        this.contentsForms.controls[index].value
      );
    } else {
      this.logger.log('index ==> ',  this.contentsForms.controls)

      this.dashSrv.updateExercies(value).then((success) => {
        if (success)
          this.contentsForms.controls[contentIndex].controls[
            'exercises'
          ].controls[index].patchValue(success as any);
      });
    }
  }
  removeExericse(contentIndex: number, index: number) {
    this.dialogSrv.message(
      'حذف تمرين',
      'هل تريد حقا حذف هذا التمرين؟',
      () => {
        const content =    this.contentsForms.controls[contentIndex];
        const exercise =     content.controls[
          'exercises'
        ].controls[index]
        //after complete,  delete
        if(exercise.value.id) {
          this.dashSrv.deleletExercies(exercise.value.id).then((res) => {
            if(res)
            content.controls[
              'exercises'
            ].removeAt(index);
          })
        } else {
          content.controls[
            'exercises'
          ].removeAt(index)
        }

      },
      'delete'
    );
  }
  addAnswer(answer: FormArray) {
    answer.push(new FormControl());
  }
  removeAnswer(answer: FormArray) {
    answer.removeAt(answer.controls.length - 1);
  }
}
