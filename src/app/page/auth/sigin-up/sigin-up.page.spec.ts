import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SiginUpPage } from './sigin-up.page';

describe('SiginUpPage', () => {
  let component: SiginUpPage;
  let fixture: ComponentFixture<SiginUpPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SiginUpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
