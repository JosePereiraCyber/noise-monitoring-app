import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AlertsDashboardComponent } from './alerts-dashboard.component';

describe('AlertsDashboardComponent', () => {
  let component: AlertsDashboardComponent;
  let fixture: ComponentFixture<AlertsDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AlertsDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
