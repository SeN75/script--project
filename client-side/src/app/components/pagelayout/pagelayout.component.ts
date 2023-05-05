import { MediaMatcher } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'pagelayout',
  templateUrl: './pagelayout.component.html',
  styleUrls: ['./pagelayout.component.scss']
})
export class PagelayoutComponent {
  mobileQuery: MediaQueryList;

  @Input() template: TemplateRef<any> | undefined;
  @Input() navTemplate: TemplateRef<any> | undefined;
  @Input() sideTemplate: TemplateRef<any> | undefined;
  @Input() open  = false
  @Input() bg = true;
  private _mobileQueryListener: () => void;


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private router: Router, ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
