import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NoiseCirclesComponent } from './noise-circles.component';

describe('NoiseCirclesComponent', () => {
  let component: NoiseCirclesComponent;
  let fixture: ComponentFixture<NoiseCirclesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoiseCirclesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NoiseCirclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
