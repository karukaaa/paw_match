import { TestBed } from '@angular/core/testing';

import { AnimalApi } from './animal-api';

describe('AnimalApi', () => {
  let service: AnimalApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimalApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
