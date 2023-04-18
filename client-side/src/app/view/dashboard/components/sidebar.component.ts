import { Component } from '@angular/core';

@Component({
  selector: 'sidebar',
  template: `
    <div class="sidebarContainer">
      <nav class="sidebar">
        <a [routerLink]="item.path" routerLinkActive="active" *ngFor="let item of sidebar">
        <mat-icon > {{item.img}}</mat-icon>
        </a>
      </nav>
    </div>
  `,
  styles: [
    `
      .sidebarContainer {
        display: flex;
        flex-direction: column;
        height: 100vh;
        gap: 3rem;
        @apply border-solid border-[1px] border-green-500  bg-gray-900  text-white;

      }

      .sidebarLogo {
        display: flex;
        flex-direction: column;
        align-items: center;
        @apply border-solid border-[1px] border-green-500  bg-gray-900  text-white;

      }

      .sidebar {
        @apply flex flex-col items-center gap-8 p-4;

        & a{

          @apply w-[30px] h-[30px] flex justify-center items-center rounded-sm transition-all duration-300;

          &.active {
            @apply  transition-all duration-300  bg-green-500  border-gray-900  text-gray-900;


            & mat-icon {
              filter: brightness(0) invert(1);
            }
          }
          &:hover {
            @apply transition-all duration-300;
            @apply  bg-green-500  border-gray-900  text-gray-900;
          ;

          }
        }
      }

      .sidebarLogoIcon {
        @apply w-auto h-[60px];
      }

      .sidebarIcons {
        width: 32px;
        height: 31px;
      }
    `,
  ],
})
export class SidebarComponent {
  sidebar = [
    {
      path: 'subject',
      img: 'subtitles',
    },
    {
      path: 'lesson',
      img: 'ballot',
    },
    {
      path: 'content',
      img: 'content_paste',
    },
    {
      path: 'exerices',
      img: 'calculate',
    },

  ];
}
