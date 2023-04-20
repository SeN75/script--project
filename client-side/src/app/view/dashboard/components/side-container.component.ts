import { Component, Input } from "@angular/core";


@Component({
  selector: 'side-container',
  styles: [`
    main {

      &.open {

        & .overlay{
          @apply fixed inset-0 bg-black opacity-25 transition-all duration-300 z-10;
        }
        & .side {
          @apply  fixed top-0 bottom-0 transition-all duration-300 z-20;
          transform: translateX(0);
        }
      }
      & .side {
          @apply  fixed top-0 bottom-0 right-0 transition-all duration-300 z-20  border-green-500  bg-gray-900 min-w-[350px];
          @apply flex flex-col gap-8 rounded-md;
          transform: translateX(1000px);
          box-shadow: 3px 1px 7px rgb(87 113 116 / 12%), -5px 1px 19px -7px rgb(108 133 145 / 32%);
          & > header {
            border-top-left-radius: inherit;
            @apply border-solid border-[1px] border-b-gray-300 h-[62px] text-[1.2rem] p-4 flex items-center;
          }
          & > ng-content {
            @apply p-4;
          }
          & > .action {
  @apply self-end flex justify-center w-full border-solid  border-[1px] border-transparent border-t-gray-300 h-[62px] items-center gap-4;
  margin-block-start: auto;
}

        }
    }

  `],
  template: `
  <main [class.open]="settings.isOpen">
    <section class="overlay" (click)="settings.isOpen = false"></section>
    <section class="side">
      <header>{{settings.title}}</header>
      <ng-content></ng-content>
    </section>
  </main>

  `
})

export class SideContainerComponent {
  @Input() settings: {isOpen?: boolean, title?:string} = {isOpen: false,};
}
