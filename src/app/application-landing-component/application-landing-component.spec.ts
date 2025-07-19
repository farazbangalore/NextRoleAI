import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationLandingComponent } from './application-landing-component';

describe('ApplicationLandingComponent', () => {
  let component: ApplicationLandingComponent;
  let fixture: ComponentFixture<ApplicationLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationLandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
