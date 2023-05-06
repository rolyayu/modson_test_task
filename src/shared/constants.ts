export const constants = {
  refreshTokenExpiration: '30 days',
  accessTokenExpiration: '15 mins',
  refreshCookieMaxAge: 1000 * 60 * 60 * 24 * 30,
  accessCookieMaxAge: 1000 * 60 * 15,
} as const;
