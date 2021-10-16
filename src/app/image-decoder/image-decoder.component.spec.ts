import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageDecoderComponent } from './image-decoder.component';

describe('ImageDecoderComponent', () => {
  let component: ImageDecoderComponent;
  let fixture: ComponentFixture<ImageDecoderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageDecoderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageDecoderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
