import { TestBed } from '@angular/core/testing';

import { TwitchLogApiService } from './twitch-log-api.service';

describe('TwitchLogApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TwitchLogApiService = TestBed.get(TwitchLogApiService);
    expect(service).toBeTruthy();
  });
});
