import { MediaMatcher } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'pagelayout',
  templateUrl: './pagelayout.component.html',
  styleUrls: ['./pagelayout.component.scss']
})
export class PagelayoutComponent implements AfterViewInit{
  aboutus() {
 window.open('https://salehalsaggaf75.web.app/', '_self')
   }
  mobileQuery: MediaQueryList;

  @Input() template: TemplateRef<any> | undefined;
  @Input() navTemplate: TemplateRef<any> | undefined;
  @Input() sideTemplate: TemplateRef<any> | undefined;
  @Input() open  = false
  @Input() bg = true;


  @ViewChild('snav') sidenav!: MatSidenav
  private _mobileQueryListener: () => void;

  sideSub: Subscription | null=  null;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, private sharedSrv: SharedService ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () =>  {
      changeDetectorRef.detectChanges();
    };

    this.mobileQuery.addListener(this._mobileQueryListener);

    this.sideSub = this.sharedSrv.toggleSidenav$.subscribe(value => {
      console.log('changged')

      this.toggle();
    })

  }
  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  toggle() {
    this.sidenav.toggle();
 }


}
