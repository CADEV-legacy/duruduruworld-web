import qs from 'querystring';

import axios from 'axios';
import CryptoJS from 'crypto-js';

import { getFullDate } from '@/(server)/util';

import { InternalServerError, NotFound, isBaseError } from '@/(error)';

import { SERVER_SETTINGS } from '@/setting';

type NaverSENSCheckSMSRequestResponse = {
  statusCode: string;
  statusName: string;
  messages: [
    {
      requestId: string;
      campaignId: string;
      messageId: string;
      requestTime: string;
      contentType: string;
      type: string;
      countryCode: string;
      from: string;
      to: string;
      completeTime: string;
      telcoCode: string;
      status: string;
      statusCode: string;
      statusName: string;
      statusMessage: string;
    },
  ];
  pageIndex: string;
  pageSize: string;
  itemCount: string;
  hasMore: string;
};

export const getSMSVerificationCount = async (phoneNumber: string) => {
  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID',
    });

  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID',
    });

  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER',
    });

  const domain = 'https://sens.apigw.ntruss.com';
  const url = `/sms/v2/services/${SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID}/messages`;
  const timestamp = Date.now().toString();
  const method = 'GET';
  const today = new Date();
  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  const requestStartTime = getFullDate(today);
  const requestEndTime = getFullDate(tomorrow);

  try {
    const params = {
      requestStartTime: requestStartTime,
      requestEndTime,
      from: SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER,
      to: phoneNumber,
    };

    const signature = getSignature({
      method,
      url: `${url}?${qs.stringify(params)}`,
      timestamp,
    });

    const response = await axios<NaverSENSCheckSMSRequestResponse>({
      method,
      url: `${domain}${url}`,
      headers: {
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID,
        'x-ncp-apigw-signature-v2': signature,
      },
      params,
      paramsSerializer: params => qs.stringify(params),
    });

    return response.data.itemCount;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).response?.data.status === 404) return '0';

    if (isBaseError(error)) throw error;

    throw new InternalServerError({ type: 'InternalServerError', code: 500 });
  }
};

type NaverSENSSendSMSResponse = {
  requestId: string;
  requestTime: string;
  statusCode: string;
  statusName: string;
  count: number;
  statusMessage: string;
  requestIdList: Array<string>;
};

export const sendSMSVerificationCode = async (phoneNumber: string, verificationCode: string) => {
  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID',
    });

  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID',
    });

  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER',
    });

  const domain = 'https://sens.apigw.ntruss.com';
  const url = `/sms/v2/services/${SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_ID}/messages`;
  const timestamp = Date.now().toString();
  const method = 'POST';
  const content = `[Duruduru]\n인증번호는 ${verificationCode}입니다.`;

  try {
    const signature = getSignature({
      method,
      url,
      timestamp,
    });

    const response = await axios<NaverSENSSendSMSResponse>({
      method,
      url: `${domain}${url}`,
      headers: {
        'Content-Type': 'application/json; utf-8',
        'x-ncp-apigw-timestamp': timestamp,
        'x-ncp-iam-access-key': SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID,
        'x-ncp-apigw-signature-v2': signature,
      },
      data: {
        type: 'SMS',
        contentType: 'COMM',
        countryCode: '82',
        from: SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SENS_SERVICE_PHONENUMBER,
        content: content,
        messages: [
          {
            to: phoneNumber,
            content,
          },
        ],
      },
    });

    return response.data;
  } catch (error) {
    if (isBaseError(error)) throw error;

    throw new InternalServerError({ type: 'InternalServerError', code: 500 });
  }
};

type GetSignatureProps = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  timestamp: string;
};

const getSignature = ({ method, url, timestamp }: GetSignatureProps) => {
  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID)
    throw new NotFound({
      type: 'NotFound',
      code: 404,
      detail: 'NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID',
    });

  if (!SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SECRET_KEY)
    throw new NotFound({ type: 'NotFound', code: 404, detail: 'NAVER_CLOUD_PLATFORM_SECRET_KEY' });

  const SPACE = ' ';
  const NEW_LINE = '\n';

  const hmac = CryptoJS.algo.HMAC.create(
    CryptoJS.algo.SHA256,
    SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_SECRET_KEY
  );

  hmac.update(method);
  hmac.update(SPACE);
  hmac.update(url);
  hmac.update(NEW_LINE);
  hmac.update(timestamp);
  hmac.update(NEW_LINE);
  hmac.update(SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID);

  const hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
};
