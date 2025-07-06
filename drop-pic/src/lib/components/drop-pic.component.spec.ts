import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropPicComponent } from './drop-pic.component';

describe('DropPicComponent', () => {
  let component: DropPicComponent;
  let fixture: ComponentFixture<DropPicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropPicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropPicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
