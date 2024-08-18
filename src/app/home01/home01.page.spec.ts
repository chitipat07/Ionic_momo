import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home01Page } from './home01.page';

describe('Home01Page', () => {
  let component: Home01Page;
  let fixture: ComponentFixture<Home01Page>;

  beforeEach(() => {
    fixture = TestBed.createComponent(Home01Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
