import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VMDataComponent } from './vmdata.component';

describe('VMDataComponent', () => {
  let component: VMDataComponent;
  let fixture: ComponentFixture<VMDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VMDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VMDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
