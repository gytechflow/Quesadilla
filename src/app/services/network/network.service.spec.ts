import { TestBed } from '@angular/core/testing';

import { ConnectivityProvider } from './network.service';

describe('NetworkService', () => {
  let service: ConnectivityProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConnectivityProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
