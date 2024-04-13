import axios from 'axios';
import CryptoJS from 'crypto-js';

import { InternalServerError, NotFound, isBaseError } from '@/(error)';

import { SERVER_SETTINGS } from '@/setting';

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
  const content = `[nextjs-template]\n인증번호는 ${verificationCode}입니다.`;

  try {
    const signature = getSignature({
      method: 'POST',
      url,
      timestamp,
      accessKey: SERVER_SETTINGS.NAVER_CLOUD_PLATFORM_ACCESS_KEY_ID,
    });

    const response = await axios<NaverSENSSendSMSResponse>({
      method: 'POST',
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
  accessKey: string;
  timestamp: string;
};

const getSignature = ({ method, url, timestamp, accessKey }: GetSignatureProps) => {
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
  hmac.update(accessKey);

  const hash = hmac.finalize();

  return hash.toString(CryptoJS.enc.Base64);
};
