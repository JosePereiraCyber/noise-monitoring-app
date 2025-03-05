import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestCirclesComponent } from './test-circles.component';

describe('TestCirclesComponent', () => {
  let component: TestCirclesComponent;
  let fixture: ComponentFixture<TestCirclesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestCirclesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
