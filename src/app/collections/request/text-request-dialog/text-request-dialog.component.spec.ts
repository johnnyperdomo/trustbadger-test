import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextRequestDialogComponent } from './text-request-dialog.component';

describe('TextRequestDialogComponent', () => {
  let component: TextRequestDialogComponent;
  let fixture: ComponentFixture<TextRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextRequestDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
