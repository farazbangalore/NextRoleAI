import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseResumeComponent } from './base-resume-component';

describe('BaseResumeComponent', () => {
  let component: BaseResumeComponent;
  let fixture: ComponentFixture<BaseResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BaseResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
