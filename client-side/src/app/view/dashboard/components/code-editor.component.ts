import { Component, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { converter } from 'src/app/common/coder';
@Component({
  selector: 'code-editor',
  template: `
  <div #codeBlcok>

  </div>
  `,
  styles: [
`
div {
  direction: ltr;
}
`
  ]
})
export class CodeEditorComponent implements AfterViewInit{
  @Input() code:string = '';
  @ViewChild('codeBlcok') codeBlcok !: ElementRef<HTMLElement>;

  ngAfterViewInit(): void {
    console.log(converter(this.code, 'kay'))
    this.codeBlcok.nativeElement.innerHTML =converter(this.code, 'kay')
    console.log(this.codeBlcok)
  }

}
