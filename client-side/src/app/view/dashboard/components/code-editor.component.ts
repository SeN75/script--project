import { Component, Input, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { converter } from 'src/app/common/coder';
import { Exercise } from '../pages/exerices.component';
import { DashDialogSrvice } from '../dialog.service';
import { DashboardService } from '../dashboard.service';
import { AuthService, User } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'code-editor',
  template: `
  <div #codeBlcok class="editor">

  </div>
  `,
  styles: [
`
.editor {
  direction: ltr;
}

div button {
  @apply text-[32px] rounded-[15px] border-solid border-black border-[1.5px] bg-[#3BC85BB2] flex h-[52px] w-[150px] items-center justify-center cursor-pointer font-f1 font-bold ;
}
`
  ]
})
export class CodeEditorComponent implements AfterViewInit{
  @Input() code:string = '';
  @Input() exercise!: Exercise
  @ViewChild('codeBlcok', { static: false }) codeBlcok !: ElementRef<HTMLElement>;
  key: string = '';
  userData: User  | null = null
  constructor(private renderer:Renderer2, private dashDialog: DashDialogSrvice, private dashSrv: DashboardService, private auth: AuthService, private router: Router ) {
    this.auth.user$.subscribe(userData => this.userData = userData)
  }
  ngAfterViewInit(): void {
 this.key ='kay_'+ this.exercise.id!.substring(0,5);
    this.codeBlcok.nativeElement.innerHTML =converter(this.code, this.key);

    if(this.exercise.answers.length) {
      const b = this.renderer.createElement('button');
      const t = this.renderer.createText('تنفيذ');
      this.renderer.appendChild(b,t)
      this.renderer.appendChild(this.codeBlcok.nativeElement.querySelector<any>(`#run.${this.key}`), b);
      this.renderer.listen(b,'click', () => this.run())
    }


  }
  run() {
    const inputs =document.querySelectorAll<HTMLInputElement>(`input.${this.key}`);
    let allChecked = true;
    const notCorrect = []
    const answers = this.exercise.answers;
    const userAnswer = []
    for(let i =0; i < inputs.length; i++) {
      const input = inputs[i];
      userAnswer.push(input.value)
      if(input.value != answers[i]) {
      allChecked = false;
      notCorrect.push({
        index: i,
        expcted: answers[i],
        recived: input.value
      })
      break;
      }
    }
    // alert message
    if(!allChecked) {
      this.dashDialog.answer({message: "محاولة خاطئة 🫠", text: ['الرجاء المحاولة مرة اخرى']})
      console.log(notCorrect)
    }
    else {
      console.log('user code ==> ', this.userData)
      if(this.userData && Object.keys(this.userData).length) {

        this.dashSrv.sendAnswers({execise_id: this.exercise.id!,userAnswer}).then(success => {

          if(success && success.status != 406)
          this.dashDialog.answer({message: "مبرووووووك !🥳", text: ['حلك صح، تم اضافة '+this.exercise.point+' نقطة الى حسابك']})
          else if (success.status  == 406)
          this.dashDialog.answer({message: "كفو عليك، حلك صح 🥳", text: ['لكن للاسف مانقدر نحسب لك نقاط عشانك حليته اول 👀', ' تقدر تكمل وتحل وتكمل في المستويات الجاية 😎'] })

        }).catch( erro => console.warn(erro))
      } else  {
        // كفو عليك، حلك صح 🥳
        // لكن للاسف مانقدر نحسب لك نقاط عشانك منت مسجل 🤐
        // سجل دخولك ونافس معانا 😏
        this.dashDialog.answer({message: "كفو عليك، حلك صح 🥳", text:  ['لكن للاسف مانقدر نحسب لك نقاط عشانك منت مسجل 🤐', 'سجل دخولك ونافس معانا 😏'], actionName: 'سجل الدخول', action: () => {
          this.router.navigate(['/register', 'login'])
        },})

      }
    }
  }
}
