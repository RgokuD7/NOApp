import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LostPage } from './lost.page';

describe('LostPage', () => {
  let component: LostPage;
  let fixture: ComponentFixture<LostPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
