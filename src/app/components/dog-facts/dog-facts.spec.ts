import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DogFacts } from './dog-facts';

describe('DogFacts', () => {
  let component: DogFacts;
  let fixture: ComponentFixture<DogFacts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DogFacts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DogFacts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
