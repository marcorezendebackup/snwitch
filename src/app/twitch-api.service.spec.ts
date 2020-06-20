import { TestBed } from '@angular/core/testing';

import { TwitchApiService } from './twitch-api.service';

describe('TwitchApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TwitchApiService = TestBed.get(TwitchApiService);
    expect(service).toBeTruthy();
  });
});
