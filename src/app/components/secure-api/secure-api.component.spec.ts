import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SecureApiComponent } from './secure-api.component';

describe('SecureApiComponent', () => {
  let component: SecureApiComponent;
  let fixture: ComponentFixture<SecureApiComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SecureApiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SecureApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
