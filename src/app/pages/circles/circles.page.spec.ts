import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CirclesPage } from './circles.page';

describe('CirclesPage', () => {
  let component: CirclesPage;
  let fixture: ComponentFixture<CirclesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CirclesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
