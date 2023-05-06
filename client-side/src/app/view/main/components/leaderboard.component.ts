import { Component } from '@angular/core';
import { MainService } from '../main.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'leaderboard',
  styles: [
    `
      main {
        @apply flex flex-col items-center  gap-4 max-w-[1350px] w-[95%] mx-auto;
        & h2 {
          @apply font-bold font-f1 lg:text-[48px] md:text-[38px] sm:text-[32px] text-[#46B15E];
        }
        & p {
          @apply font-bold font-f1 lg:text-[24px] md:text-[22px] md:text-[18px] text-white;
        }
        & .board {
          @apply py-6 bg-[#011627] rounded-lg w-full items-center pt-12 px-8;
          & th {
            @apply font-f1 lg:text-[20px] md:text-[18px] md:text-[16px] font-bold text-white;
          }
          border-collapse: separate;
          border-spacing: 0 1.2rem;

        }
      }

tbody tr {
        background: linear-gradient(
          180deg,
          rgba(0, 255, 57, 0.15) 0%,
          rgba(0, 255, 57, 0.06) 100%
        );

        & .name {
          @apply flex gap-4 items-center font-bold lg:text-[20px] md:text-[18px] md:text-[16px];
          & .avatar {
            @apply flex justify-center items-center bg-[#011627] rounded-[9px] h-[50px] w-[50px] text-[32px];
          }
        }
        & td {
          border: 1.5px solid rgba(0, 0, 0, 0.5);
          border-right: none;
          border-left: none;
          @apply px-2 text-center;
          &:first-child {

            @apply rounded-tr-[16px] rounded-br-[16px];
            border-right: 1.5px solid rgba(0, 0, 0, 0.5);
          }
          &:last-child {
            border-left: 1.5px solid rgba(0, 0, 0, 0.5);
            @apply rounded-tl-[16px] rounded-bl-[16px];

          }
        }
        & .point {
          @apply lg:text-[20px] md:text-[18px] md:text-[16px] font-bold text-white;
        }

        & .level {
          @apply lg:text-[48px] md:text-[38px] sm:text-[32px] font-f1 font-bold text-white;
          &.st {
            @apply text-[#ffd700];
          }
          &.nd {
            @apply text-[#808080];
          }
          &.rd {
            @apply text-[#CD7F32];
          }
        }
      }
    `,
  ],
  template: `
    <main>
      <h2>افضل المتصدرين</h2>
      <p>الافضل في جميع الاوقات</p>
      <table class="board">
        <thead>
          <tr>
            <th>المستخدم</th>
            <th>النقاط</th>
            <th>المركز</th>
          </tr>
        </thead>

        <tbody>
          <tr *ngFor="let user of board$ | async" ckass="place">
            <td>

              <div class="name">
                <div class="avatar">👑</div>
                <span>@{{ user.username }}</span>
              </div>
            </td>
            <td class="point">{{ user.point }} xp</td>
            <td
              class="level"
              [class.st]="user.level == 1"
              [class.nd]="user.level == 2"
              [class.rd]="user.level == 3"
            >
              {{ user.level }}
            </td>
          </tr>
        </tbody>
      </table>
    </main>
  `,
})
export class LeaderBoardComponent {
  constructor(private mainSrv: MainService) {
    this.board$ = this.mainSrv.getLeaderBoard();
  }
  board$: Observable<{ username: string; point: number; level: number }[]> = of(
    []
  );
}
