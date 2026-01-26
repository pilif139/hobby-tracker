import { ONE_DAY, ONE_MINUTE } from '@/src/lib/time';

const authConfig = {
  accessTokenExpirationTime: ONE_MINUTE * 10,
  refreshTokenExpirationTime: ONE_DAY * 30,
} as const;

export default authConfig;
