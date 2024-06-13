import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddVetPage } from './add-vet.page';

describe('AddVetPage', () => {
  let component: AddVetPage;
  let fixture: ComponentFixture<AddVetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
