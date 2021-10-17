import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumBottomSheetComponent } from './album-bottom-sheet.component';

describe('AlbumBottomSheetComponent', () => {
  let component: AlbumBottomSheetComponent;
  let fixture: ComponentFixture<AlbumBottomSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumBottomSheetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlbumBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
