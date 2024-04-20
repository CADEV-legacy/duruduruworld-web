import { ACCOUNT_STATUS, ACCOUNT_TYPE, PET_TYPE } from './(server)/union';

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
      pet: '/auth/update/pet',
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
  faq: '/faq',
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
  kakao: '#FFEB00',
  kakaoHover: '#C6A200',
  success: '#63B100',
  error: '#f00',
  errorHover: '#cc0000',
  warning: '#EAD200',
  themeColor1: '#91591d',
  themeColor1Hover: '#9B866E',
  themeColor2: '#43270a',
  themeColor2Hover: '#9B866E',
  myPageBackground: '#FFF5E9',
  divider: '#cbcbcb',
  inputBorder: '#8b8b8bb3',
  blackAlpha: (opacity: number) => `rgba(0, 0, 0, ${opacity})`,
  whiteAlpha: (opacity: number) => `rgba(255, 255, 255, ${opacity})`,
} as const;

export const OUTER_LINK = {
  termOfUse: 'https://www.naver.com',
  privacyPolicy: 'https://www.naver.com',
  inquiry: 'https://www.naver.com',
  youtubeContent: 'https://www.youtube.com/watch?v=z8XnMU1VQmw',
} as const;

export const GLOBAL_Z_INDEX = {
  outer: 10,
};

export const PET_NAME = {
  [PET_TYPE.goldenRetriever]: '골든리트리버',
  [PET_TYPE.greatDane]: '그레이트 데인',
  [PET_TYPE.greatPyrenees]: '그레이트 피레니즈',
  [PET_TYPE.grayHound]: '그레이하운드',
  [PET_TYPE.cotonDeTulear]: '꼬똥드뚤레아',
  [PET_TYPE.neopolitanMastiff]: '네오폴리탄마스티프',
  [PET_TYPE.norwichTerrier]: '노리치테리어',
  [PET_TYPE.newFoundland]: '뉴펀들랜드',
  [PET_TYPE.dachshund]: '닥스훈트',
  [PET_TYPE.dalmatian]: '달마시안',
  [PET_TYPE.dandyDeanmontTerrier]: '덴디딘몬드테리어',
  [PET_TYPE.dogokanirio]: '도고까니리오',
  [PET_TYPE.dogoArgentino]: '도고아르젠티노',
  [PET_TYPE.doberman]: '도베르만',
  [PET_TYPE.tosa]: '도사',
  [PET_TYPE.tokyo]: '동경',
  [PET_TYPE.labradorRetriever]: '라브라도리트리버',
  [PET_TYPE.lhasaApso]: '라사압소',
  [PET_TYPE.Leica]: '라이카',
  [PET_TYPE.rabbitDachshund]: '래빗닥스훈트',
  [PET_TYPE.ratTerrier]: '랫테리어',
  [PET_TYPE.lakelandTerrier]: '레이크랜드테리어',
  [PET_TYPE.rhodesianLeedsBag]: '로디지안리즈백',
  [PET_TYPE.rottweiler]: '로트와일러',
  [PET_TYPE.malinois]: '마리노이즈',
  [PET_TYPE.mastiff]: '마스티프',
  [PET_TYPE.malamute]: '말라뮤트',
  [PET_TYPE.maltiese]: '말티즈',
  [PET_TYPE.manchesterTerrier]: '맨체스터테리어',
  [PET_TYPE.miniatureDachshund]: '미니어처닥스훈트',
  [PET_TYPE.miniatureBullTerrier]: '미니어처불테리어',
  [PET_TYPE.miniatureSchnauzer]: '미니어처슈나우저',
  [PET_TYPE.miniaturePoodle]: '미니어처푸들',
  [PET_TYPE.miniaturePinscher]: '미니어처핀셔',
  [PET_TYPE.mediumPoodle]: '미디엄푸들',
  [PET_TYPE.mittelspitz]: '미텔스피츠',
  [PET_TYPE.mixed]: '믹스견',
  [PET_TYPE.basenji]: '바센지',
  [PET_TYPE.bassetHarwood]: '바셋하운드',
  [PET_TYPE.berneseMountainDog]: '버니즈마운틴독',
  [PET_TYPE.bedlingtonTerrier]: '베들링턴테리아',
  [PET_TYPE.belgiumGroenendael]: '벨기에그로넨달',
  [PET_TYPE.belgianSheepdog]: '벨기에쉽독',
  [PET_TYPE.belgiumTervuren]: '벨기에테뷰런',
  [PET_TYPE.belgianShepherdDog]: '벨기안셰퍼드독',
  [PET_TYPE.borderCollie]: '보더콜리',
  [PET_TYPE.borzoi]: '보르조이',
  [PET_TYPE.bostonTerrier]: '보스턴테리어',
  [PET_TYPE.etc]: '기타',
} as const;

export const ACCOUNT_TYPE_NAME = {
  [ACCOUNT_TYPE.credential]: '가입사용자',
  [ACCOUNT_TYPE.kakao]: '카카오계정',
} as const;

export const ACCOUNT_STATUS_NAME = {
  [ACCOUNT_STATUS.active]: '활성 (배송받기)',
  [ACCOUNT_STATUS.inactive]: '비활성 (배송중지)',
  [ACCOUNT_STATUS.pending]: '대기',
  [ACCOUNT_STATUS.withdrew]: '탈퇴',
} as const;
