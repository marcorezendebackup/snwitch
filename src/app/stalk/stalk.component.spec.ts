import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StalkComponent } from './stalk.component';

describe('StalkComponent', () => {
  let component: StalkComponent;
  let fixture: ComponentFixture<StalkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StalkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StalkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
