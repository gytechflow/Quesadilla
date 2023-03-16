import { TestBed } from '@angular/core/testing';

import { NetworkErrorRouterService } from './network-error-router.service';

describe('NetworkErrorRouterService', () => {
  let service: NetworkErrorRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkErrorRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
