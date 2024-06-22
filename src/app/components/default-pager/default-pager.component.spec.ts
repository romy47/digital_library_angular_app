import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPagerComponent } from './default-pager.component';

describe('DefaultPagerComponent', () => {
  let component: DefaultPagerComponent;
  let fixture: ComponentFixture<DefaultPagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefaultPagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefaultPagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
