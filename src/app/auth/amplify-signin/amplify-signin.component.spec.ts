import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmplifySigninComponent } from './amplify-signin.component';

describe('AmplifySigninComponent', () => {
  let component: AmplifySigninComponent;
  let fixture: ComponentFixture<AmplifySigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmplifySigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmplifySigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
