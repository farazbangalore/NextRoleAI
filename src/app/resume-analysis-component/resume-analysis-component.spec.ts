import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeAnalysisComponent } from './resume-analysis-component';

describe('ResumeAnalysisComponent', () => {
  let component: ResumeAnalysisComponent;
  let fixture: ComponentFixture<ResumeAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResumeAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
