import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VetPage } from './vet.page';

describe('VetPage', () => {
  let component: VetPage;
  let fixture: ComponentFixture<VetPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
