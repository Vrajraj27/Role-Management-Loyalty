import { JwtAccessTokenGuard } from './jwt-access-token.guard';

describe('JwtAccessTokenGuard', () => {
  it('should be defined', () => {
    expect(new JwtAccessTokenGuard()).toBeDefined();
  });
});
