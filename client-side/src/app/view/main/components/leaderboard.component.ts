import { Component } from '@angular/core';

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
          @apply flex flex-col gap-4 py-6 bg-[#011627] rounded-lg w-full items-center pt-12;
          & header {
            @apply flex justify-between font-f1 lg:text-[20px] md:text-[18px] md:text-[16px] font-bold text-white w-full  w-[95%] px-6;
          }
          & .place {
            @apply flex justify-between gap-4 items-center min-h-[86px] w-[95%] px-6 rounded-[10px];
            background: linear-gradient(
              180deg,
              rgba(0, 255, 57, 0.15) 0%,
              rgba(0, 255, 57, 0.06) 100%
            );
            border: 1.5px solid rgba(0, 0, 0, 0.5);
            & .name {
              @apply flex gap-4 items-center font-bold lg:text-[20px] md:text-[18px] md:text-[16px];
              & .avatar {
                @apply flex justify-center items-center bg-[#011627] rounded-[9px] h-[50px] w-[50px] text-[32px];
              }
            }

            & .point {
              @apply lg:text-[20px] md:text-[18px] md:text-[16px] font-bold text-white ;
            }

            & .level {
              @apply lg:text-[48px] md:text-[38px] sm:text-[32px] font-f1 font-bold text-white;
              &.st {
                @apply text-[#FDCD25];
              }
              &.nd {
                @apply text-[#B3C2DC];

              }
              &.rd {
                @apply text-[#773B06];

              }
            }
          }
        }
      }
    `,
  ],
  template: `
    <main>
      <h2>افضل المتصدرين</h2>
      <p>الافضل في جميع الاوقات</p>

      <div class="board">
        <header>
          <div>المستخدم</div>
          <div>النقاط</div>
          <div>المركز</div>
        </header>

        <div class="place">
          <div class="name">
            <div class="avatar">👑</div>
            <span>@name</span>
          </div>

          <div class="point">10000 xp</div>

          <div class="level st">1</div>
        </div>

        <div class="place">
          <div class="name">
            <div class="avatar">👑</div>
            <span>@name</span>
          </div>

          <div class="point">10000 xp</div>

          <div class="level nd">1</div>
        </div>

        <div class="place">
          <div class="name">
            <div class="avatar">👑</div>
            <span>@name</span>
          </div>

          <div class="point">10000 xp</div>

          <div class="level rd">1</div>
        </div>


      </div>
    </main>
  `,
})
export class LeaderBoardComponent {}
