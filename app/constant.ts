/** NOTE: Back-end Part */
export const API_URL = {
  auth: {
    prefix: '/auth',
    delete: '/auth/delete',
    duplicateAccountCheck: '/auth/duplicate-account-check',
    duplicateEmailCheck: '/auth/duplicate-email-check',
    findMyEmail: '/auth/find-my-email',
    passwordReset: '/auth/password-reset',
    refreshToken: '/auth/refresh-token',
    reissueToken: '/auth/reissue-token',
    signIn: '/auth/sign-in',
    signOut: '/auth/sign-out',
    signUp: '/auth/sign-up',
    sso: {
      prefix: '/sso',
      signUp: '/auth/sso/sign-up',
      register: '/auth/sso/register',
    },
    update: {
      prefix: '/update',
      email: '/auth/update/email',
      me: '/auth/update/me',
      password: '/auth/update/password',
      status: '/auth/update/status',
    },
    verificationCode: {
      prefix: '/verification-code',
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

/** NOTE: Front-end Part */
export const ROUTE_URL = {
  home: '/',
  auth: {
    prefix: '/auth',
    signUp: '/auth/sign-up',
    signIn: '/auth/sign-in',
    findMyEmail: '/auth/find-my-email',
    passwordReset: '/auth/password-reset',
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

export const MILLISECOND_TIME_FORMAT = {
  millisecond: 1,
  seconds: (second: number) => MILLISECOND_TIME_FORMAT.millisecond * 1000 * second,
  minutes: (minute: number) => MILLISECOND_TIME_FORMAT.seconds(60) * minute,
  hours: (hour: number) => MILLISECOND_TIME_FORMAT.minutes(60) * 60 * hour,
  days: (day: number) => MILLISECOND_TIME_FORMAT.hours(24) * day,
} as const;

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
  blackAlpha: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  whiteAlpha: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
} as const;

/** NOTE: General Part */
export const AUTHORIZATION = {
  key: 'Authorization',
  value: 'Bearer ',
} as const;

export const DIGITAL_FORMAT = {
  kiloByte: 1024,
  megaByte: (megaByte: number) => Math.pow(DIGITAL_FORMAT.kiloByte, 2) * megaByte,
} as const;
