import { Component, Input, OnInit } from "@angular/core";


@Component({
  selector: 'bread-craumb',
  template: `
  <nav>
    <span *ngIf="page == 'branch' ">{{selectedStore.id != 0 ?selectedStore.name : 'store'}}/</span>
    <span *ngIf="page == 'map' || page == 'category' ||  page == 'items'">{{ selectedBranch.id != 0 ? selectedBranch.name : 'branch'}}/</span>
    <span *ngIf="page == 'map' ||   page == 'items'">{{selectedCategory.id != 0 ? selectedCategory.name : 'category'}}/</span>
  </nav>
  `,
  styles: [`
    nav {
      @apply w-full flex items-center h-[62px] text-[#372854] text-[16px] px-8;
      @apply border-solid border-[1px] border-green-500  bg-gray-900  text-white;

      border-radius: 4px;
    }

  `]
})
export class BreadCraumbComponent implements OnInit {
 @Input() selectedStore = {
    id: 1,
    name: "Danub"
  }
 @Input() selectedBranch = {
    id: 0,
    name: "Danub"
  }
 @Input() selectedCategory = {
    id: 0,
    name: "Danub"
  }
  @Input() page : 'store' | 'branch' | 'map' | 'category' | 'items' | string = 'store'
  ngOnInit(): void {
  }

}
