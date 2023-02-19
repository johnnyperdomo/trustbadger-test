import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterBrandingComponent } from './footer-branding.component';

describe('FooterBrandingComponent', () => {
  let component: FooterBrandingComponent;
  let fixture: ComponentFixture<FooterBrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterBrandingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
