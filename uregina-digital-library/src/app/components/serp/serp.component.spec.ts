import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SerpComponent } from './serp.component';

describe('SerpComponent', () => {
  let component: SerpComponent;
  let fixture: ComponentFixture<SerpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
