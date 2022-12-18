import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowcaseAllComponent } from './showcase-all.component';

describe('ShowcaseAllComponent', () => {
  let component: ShowcaseAllComponent;
  let fixture: ComponentFixture<ShowcaseAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowcaseAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowcaseAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
