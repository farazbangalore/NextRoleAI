import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobResumeComponent } from './job-resume-component';

describe('JobResumeComponent', () => {
  let component: JobResumeComponent;
  let fixture: ComponentFixture<JobResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
