import { RoleGuard } from './role.guard';
import { Reflector } from '@nestjs/core';

describe('RoleGuard', () => {
  it('should be defined', () => {
    const reflector = new Reflector();
    expect(new RoleGuard(reflector)).toBeDefined();
  });
});
