import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrendChartComponent } from './trend-chart.component';

describe('TrendChartComponent', () => {
  let component: TrendChartComponent;
  let fixture: ComponentFixture<TrendChartComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TrendChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrendChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
