import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddStorePage } from './add-store.page';

describe('AddStorePage', () => {
  let component: AddStorePage;
  let fixture: ComponentFixture<AddStorePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
