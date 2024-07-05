import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchTarjetasPage } from './search-tarjetas.page';

describe('SearchTarjetasPage', () => {
  let component: SearchTarjetasPage;
  let fixture: ComponentFixture<SearchTarjetasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTarjetasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
