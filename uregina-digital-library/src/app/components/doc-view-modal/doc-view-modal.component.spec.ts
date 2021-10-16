import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocViewModalComponent } from './doc-view-modal.component';

describe('DocViewModalComponent', () => {
  let component: DocViewModalComponent;
  let fixture: ComponentFixture<DocViewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocViewModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
