import { NextRequest } from 'next/server';

import {
  AccountSchemaSelect,
  AuthSignInCredentialRequestBody,
  AuthSignInCredentialResponse,
  AuthSignInKakaoRequestBody,
  AuthSignInKakaoResponse,
  AuthSignInRequestBody,
  CredentialSchemaSelect,
  KakaoSchemaSelect,
} from './type';

import { comparePassword, getConnection, getNewSignedTokens } from '@/(server)/lib';
import {
  AccountInformationModel,
  AccountModel,
  CredentialModel,
  KakaoModel,
} from '@/(server)/model';
import {
  SuccessResponse,
  getRequestBodyJSON,
  validate,
  getNewAuthCookie,
  getAdditionalRequestBodyJSON,
} from '@/(server)/util';

import { ErrorResponse, Forbidden, NotFound, NotImplemented } from '@/(error)';

/**
 * NOTE: /api/auth/sign-in
 * @body AuthSignInRequestBody
 * @body (option1) AuthSignInCredentialRequestBody
 * @body (option2) AuthSignInKakaoRequestBody
 * @return (option1) AuthSignInCredentialResponse
 * @return (option2) AuthSignInKakaoResponse
 */
export const POST = async (request: NextRequest) => {
  await getConnection();

  try {
    const requestBodyJSON = await getRequestBodyJSON<AuthSignInRequestBody>(request, [
      { key: 'type', required: true },
    ]);

    validate({
      accountType: requestBodyJSON.type,
    });

    if (requestBodyJSON.type === 'credential') {
      const credentialRequestBodyJSON =
        getAdditionalRequestBodyJSON<AuthSignInCredentialRequestBody>(requestBodyJSON, [
          { key: 'identifier', required: true },
          { key: 'password', required: true },
          { key: 'autoSignIn', required: true },
        ]);

      const credential = await CredentialModel.findOne({
        identifier: credentialRequestBodyJSON.identifier,
      })
        .select<CredentialSchemaSelect>('password account')
        .lean()
        .exec();

      if (!credential)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'credential',
        });

      const isAuthorized = await comparePassword(
        credentialRequestBodyJSON.password,
        credential.password
      );

      if (!isAuthorized) {
        throw new Forbidden({
          type: 'Forbidden',
          code: 403,
          detail: { field: 'password', reason: 'UNAUTHORIZED' },
        });
      }

      const account = await AccountModel.findOne({
        _id: credential.account,
      })
        .select<AccountSchemaSelect>('type status refreshToken')
        .exec();

      if (!account)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'account',
        });

      const isRestricted = account.status === 'pending' || account.status === 'withdrew';

      if (isRestricted) {
        throw new Forbidden({
          type: 'Forbidden',
          code: 403,
          detail: { field: 'accountStatus', reason: 'RESTRICTED' },
        });
      }

      const { accessToken, refreshToken } = getNewSignedTokens({
        accountId: account._id.toHexString(),
        accountType: account.type,
      });

      account.refreshToken = refreshToken;

      await account.save();

      const { refreshTokenCookie, autoSignInCookie } = getNewAuthCookie({
        value: refreshToken,
        autoSignIn: credentialRequestBodyJSON.autoSignIn,
      });

      return SuccessResponse<AuthSignInCredentialResponse>({
        method: 'POST',
        cookies: autoSignInCookie ? [refreshTokenCookie, autoSignInCookie] : [refreshTokenCookie],
        data: { accessToken },
      });
    } else if (requestBodyJSON.type === 'kakao') {
      const kakaoRequestBodyJSON = getAdditionalRequestBodyJSON<AuthSignInKakaoRequestBody>(
        requestBodyJSON,
        [
          { key: 'productAccountId', required: true },
          { key: 'autoSignIn', required: true },
        ]
      );

      const kakao = await KakaoModel.findOne({
        productAccountId: kakaoRequestBodyJSON.productAccountId,
      })
        .select<KakaoSchemaSelect>('account')
        .lean()
        .exec();

      if (!kakao)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'credential',
        });

      const [account, accountInformation] = await Promise.all([
        AccountModel.findOne({ _id: kakao.account })
          .select<AccountSchemaSelect>('type status refreshToken')
          .exec(),
        AccountInformationModel.exists({ account: kakao.account }).lean().exec(),
      ]);

      const isAccountInformationExist = !!accountInformation;

      if (!account)
        throw new NotFound({
          type: 'NotFound',
          code: 404,
          detail: 'account',
        });

      const isRestricted = account.status === 'withdrew';

      if (isRestricted) {
        throw new Forbidden({
          type: 'Forbidden',
          code: 403,
          detail: { field: 'accountStatus', reason: 'RESTRICTED' },
        });
      }

      const { accessToken, refreshToken } = getNewSignedTokens({
        accountId: account._id.toHexString(),
        accountType: account.type,
      });

      account.refreshToken = refreshToken;

      await account.save();

      const { refreshTokenCookie, autoSignInCookie } = getNewAuthCookie({
        value: refreshToken,
        autoSignIn: kakaoRequestBodyJSON.autoSignIn,
      });

      return SuccessResponse<AuthSignInKakaoResponse>({
        method: 'POST',
        cookies: autoSignInCookie ? [refreshTokenCookie, autoSignInCookie] : [refreshTokenCookie],
        data: { accessToken, isNeedMoreInformation: !isAccountInformationExist },
      });
    } else {
      // NOTE: Implement when other sso auth process is needed.

      throw new NotImplemented({
        type: 'NotImplemented',
        code: 501,
      });
    }
  } catch (error) {
    return ErrorResponse(error);
  }
};

export const dynamic = 'force-dynamic';
