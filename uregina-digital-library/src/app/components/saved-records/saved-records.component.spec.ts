import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedRecordsComponent } from './saved-records.component';

describe('SavedRecordsComponent', () => {
  let component: SavedRecordsComponent;
  let fixture: ComponentFixture<SavedRecordsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavedRecordsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
