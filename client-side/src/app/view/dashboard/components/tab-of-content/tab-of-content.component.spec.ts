import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabOfContentComponent } from './tab-of-content.component';

describe('TabOfContentComponent', () => {
  let component: TabOfContentComponent;
  let fixture: ComponentFixture<TabOfContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabOfContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabOfContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
