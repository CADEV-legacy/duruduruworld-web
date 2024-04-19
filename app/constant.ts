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

export const UNAUTH_PROTECTED_PAGE_ROUTE: string[] = [
  ROUTE_URL.auth.signIn,
  ROUTE_URL.auth.signUp,
  ROUTE_URL.auth.findMyIdentifier,
  ROUTE_URL.auth.passwordReset.prefix,
  ROUTE_URL.auth.passwordReset.result,
];
export const AUTH_PROTECTED_PAGE_ROUTE: string[] = [ROUTE_URL.user.me];

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
  success: '#0070f3',
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

export const GLOBAL_Z_INDEX = {
  outer: 10,
};

export const PET_NAME = {
  goldenRetriever: '골든리트리버',
  greatDane: '그레이트 데인',
  greatPyrenees: '그레이트 피레니즈',
  grayHound: '그레이하운드',
  cotonDeTulear: '꼬똥드뚤레아',
  neopolitanMastiff: '네오폴리탄마스티프',
  norwichTerrier: '노리치테리어',
  newFoundland: '뉴펀들랜드',
  dachshund: '닥스훈트',
  dalmatian: '달마시안',
  dandyDeanmontTerrier: '덴디딘몬드테리어',
  dogokanirio: '도고까니리오',
  dogoArgentino: '도고아르젠티노',
  doberman: '도베르만',
  tosa: '도사',
  tokyo: '동경',
  labradorRetriever: '라브라도리트리버',
  lhasaApso: '라사압소',
  Leica: '라이카',
  rabbitDachshund: '래빗닥스훈트',
  ratTerrier: '랫테리어',
  lakelandTerrier: '레이크랜드테리어',
  rhodesianLeedsBag: '로디지안리즈백',
  rottweiler: '로트와일러',
  malinois: '마리노이즈',
  mastiff: '마스티프',
  malamute: '말라뮤트',
  maltiese: '말티즈',
  manchesterTerrier: '맨체스터테리어',
  miniatureDachshund: '미니어처닥스훈트',
  miniatureBullTerrier: '미니어처불테리어',
  miniatureSchnauzer: '미니어처슈나우저',
  miniaturePoodle: '미니어처푸들',
  miniaturePinscher: '미니어처핀셔',
  mediumPoodle: '미디엄푸들',
  mittelspitz: '미텔스피츠',
  mixed: '믹스견',
  basenji: '바센지',
  bassetHarwood: '바셋하운드',
  berneseMountainDog: '버니즈마운틴독',
  bedlingtonTerrier: '베들링턴테리아',
  belgiumGroenendael: '벨기에그로넨달',
  belgianSheepdog: '벨기에쉽독',
  belgiumTervuren: '벨기에테뷰런',
  belgianShepherdDog: '벨기안셰퍼드독',
  borderCollie: '보더콜리',
  borzoi: '보르조이',
  bostonTerrier: '보스턴테리어',
  etc: '기타',
} as const;
