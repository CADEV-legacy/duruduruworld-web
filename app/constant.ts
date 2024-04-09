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
  image: {
    prefix: '/image',
    upload: '/image/upload',
    delete: '/image/delete',
  },
  post: {
    prefix: '/post',
    create: '/post/create',
    update: '/post/update',
    delete: '/post/delete',
  },
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
    error: '/auth/error',
  },
  user: {
    prefix: '/user',
    me: '/user/me',
  },
  post: {
    prefix: '/post',
    create: '/post/create',
    update: '/post/update',
    delete: '/post/delete',
  },
} as const;

export const MILLISECOND_TIME_FORMAT = {
  millisecond: 1,
  seconds: (second: number) => MILLISECOND_TIME_FORMAT.millisecond * 1000 * second,
  minutes: (minute: number) => MILLISECOND_TIME_FORMAT.seconds(60) * minute,
  hours: (hour: number) => MILLISECOND_TIME_FORMAT.minutes(60) * 60 * hour,
  days: (day: number) => MILLISECOND_TIME_FORMAT.hours(24) * day,
} as const;

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
export const COOKIE_KEY = {
  accessToken: 'nextjs_template-secure-access_token',
  refreshToken: 'nextje_template-secure-refresh_token',
  autoSignIn: 'nextjs_template-secure-auto_sign_in',
  auth: 'nextjs_template-auth',
} as const;

export const DIGITAL_FORMAT = {
  kiloByte: 1024,
  megaByte: (megaByte: number) => Math.pow(DIGITAL_FORMAT.kiloByte, 2) * megaByte,
} as const;
