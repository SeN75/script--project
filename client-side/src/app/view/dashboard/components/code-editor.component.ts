import { Component, Input, ViewChild, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { converter } from 'src/app/common/coder';
import { Exercise } from '../pages/exerices.component';
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
  key: string = ''
  constructor(private renderer:Renderer2) {

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
    for(let i =0; i < inputs.length; i++) {
      const input = inputs[i];

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
      console.log(notCorrect)
    }
  }
}
