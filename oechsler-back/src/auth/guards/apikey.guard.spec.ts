import { ApikeyGuard } from './apikey.guard';
import { Reflector } from '@nestjs/core';
import { ConfigType } from '@nestjs/config';
import config from '../../config';

describe('ApikeyGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector();
    const configService = { /* mock config service */ } as ConfigType<typeof config>;
    expect(new ApikeyGuard(reflector, configService)).toBeDefined();
  });
});
