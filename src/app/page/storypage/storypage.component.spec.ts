import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorypageComponent } from './storypage.component';

describe('StorypageComponent', () => {
  let component: StorypageComponent;
  let fixture: ComponentFixture<StorypageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorypageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
