/** NOTE: General Part */
export const AUTHORIZATION = {
  key: 'Authorization',
  value: 'Bearer ',
} as const;

export const DIGITAL_FORMAT = {
  kiloByte: 1024,
  megaByte: (megaByte: number) => Math.pow(DIGITAL_FORMAT.kiloByte, 2) * megaByte,
} as const;

export const MILLISECOND_TIME_FORMAT = {
  millisecond: 1,
  seconds: (second: number) => MILLISECOND_TIME_FORMAT.millisecond * 1000 * second,
  minutes: (minute: number) => MILLISECOND_TIME_FORMAT.seconds(60) * minute,
  hours: (hour: number) => MILLISECOND_TIME_FORMAT.minutes(60) * 60 * hour,
  days: (day: number) => MILLISECOND_TIME_FORMAT.hours(24) * day,
} as const;

/** NOTE: Back-end Part */
export const API_URL = {
  auth: {
    prefix: '/auth',
    delete: '/auth/delete',
    duplicateAccountCheck: '/auth/duplicate-account-check',
    duplicateIdentifierCheck: '/auth/duplicate-identifier-check',
    findMyIdentifier: '/auth/find-my-identifier',
    passwordReset: '/auth/password-reset',
    refreshToken: '/auth/refresh-token',
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    signUp: {
      prefix: '/auth/sign-up',
      information: '/auth/sign-up/information',
    },
    update: {
      prefix: '/auth/update',
      me: '/auth/update/me',
      password: '/auth/update/password',
      status: '/auth/update/status',
    },
    verificationCode: {
      prefix: '/auth/verification-code',
      send: '/auth/verification-code/send',
    },
  },
  health: '/health',
  user: {
    prefix: '/user',
    me: '/user/me',
    count: '/user/count',
  },
} as const;

export const SOCKET_SERVER_API_URL = {
  socket: {
    prefix: '/socket',
    health: '/socket/health',
    newUser: '/socket/new-user',
  },
} as const;

export const COOKIE_KEY = {
  refreshToken: 'duruduru-poop_bag-secure-refresh_token',
  autoSignIn: 'duruduru-poop_bag-secure-auto_sign_in',
} as const;

export const VERIFICATION_LIMIT = {
  reIssue: MILLISECOND_TIME_FORMAT.minutes(1),
  time: MILLISECOND_TIME_FORMAT.minutes(5),
  count: 5,
} as const;

/** NOTE: Front-end Part */
export const ROUTE_URL = {
  home: '/',
  auth: {
    prefix: '/auth',
    signUp: '/auth/sign-up',
    signIn: '/auth/sign-in',
    findMyIdentifier: '/auth/find-my-identifier',
    passwordReset: {
      prefix: '/auth/password-reset',
      result: '/auth/password-reset/result',
    },
    new: '/auth/new',
  },
  user: {
    prefix: '/user',
    me: '/user/me',
  },
  company: {
    prefix: '/company',
    introduction: '/company/introduction',
    service: '/company/service',
  },
} as const;

export const SESSION_STORAGE_KEY = {
  authStore: 'auth-store',
};

// TODO: Implement this after get figma.
export const COLOR = {
  black: '#000000',
  white: '#ffffff',
  themePurple: '#743ad5',
  themePink: '#d53a9d',
  kakao: '#FFEB00',
  kakaoHover: '#C6A200',
  button: '#0070f3',
  buttonHover: '#0053b3',
  error: '#ff0000',
  errorHover: '#cc0000',

  themeColor1: '#91591d',
  themeColor1Hover: '#9B866E',
  themeColor2: '#43270a',
  themeColor2Hover: '#9B866E',
  divider: '#cbcbcb',
  inputBorder: '#8b8b8bb3',
  blackAlpha: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  whiteAlpha: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
} as const;

export const OUTER_LINK = {
  termOfUse: 'https://www.naver.com',
  privacyPolicy: 'https://www.naver.com',
  inquiry: 'https://www.naver.com',
} as const;
