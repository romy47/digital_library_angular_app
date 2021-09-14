import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFoldersComponent } from './my-folders.component';

describe('MyFoldersComponent', () => {
  let component: MyFoldersComponent;
  let fixture: ComponentFixture<MyFoldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyFoldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFoldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
