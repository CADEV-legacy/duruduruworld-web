import { NextRequest, NextResponse } from 'next/server';

import { ErrorResponse, Forbidden, NotFound } from '@/(error)';

import {
  AUTHORIZATION,
  AUTH_PROTECTED_PAGE_ROUTE,
  COOKIE_KEY,
  ROUTE_URL,
  UNAUTH_PROTECTED_PAGE_ROUTE,
} from '@/constant';
import { SERVER_SETTINGS } from '@/setting';

const CORS_OPTIONS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// NOTE: On middleware part, access token and refresh token must set in cookies.
export const middleware = async (request: NextRequest) => {
  const isAPIRoute = request.nextUrl.pathname.startsWith(SERVER_SETTINGS.API_PREFIX);

  const isUnAuthProtectedPageRoute = UNAUTH_PROTECTED_PAGE_ROUTE.includes(request.nextUrl.pathname);
  const isAuthProtectedPageRoute = AUTH_PROTECTED_PAGE_ROUTE.includes(request.nextUrl.pathname);

  const accessToken = request.headers.get(AUTHORIZATION.key);
  const refreshTokenCookie = request.cookies.get(COOKIE_KEY.refreshToken);

  if (accessToken && !refreshTokenCookie) {
    // NOTE: If access token is included in the request but refresh token is not included, remove the access token from the request.

    request.cookies.delete(COOKIE_KEY.autoSignIn);

    const error = new Forbidden({
      type: 'Forbidden',
      code: 403,
      detail: { field: 'accessToken', reason: 'UNAUTHORIZED' },
    });

    const errorResponse = ErrorResponse(error);

    errorResponse.cookies.delete(COOKIE_KEY.autoSignIn);

    return errorResponse;
  }

  if (isAPIRoute) {
    // NOTE: Case of API routes

    const origin = request.headers.get('origin');

    if (!SERVER_SETTINGS.DOMAIN)
      throw new NotFound({ type: 'NotFound', code: 404, detail: 'DOMAIN' });

    if (origin && origin !== SERVER_SETTINGS.DOMAIN) {
      // NOTE: Handle CORS

      const isPreflight = request.method === 'OPTIONS';

      const isAccessAllowedOrigin = SERVER_SETTINGS.ACCESS_ALLOWED_ORIGINS.includes(origin);

      if (isPreflight) {
        const preflightHeaders = {
          ...(isAccessAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
          ...CORS_OPTIONS,
        };

        return NextResponse.json({}, { headers: preflightHeaders });
      }

      if (isAccessAllowedOrigin) {
        const response = NextResponse.next();

        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Credentials', 'true');

        Object.entries(CORS_OPTIONS).forEach(([key, value]) => {
          response.headers.set(key, value);
        });

        return response;
      }
    }
  } else {
    // NOTE: Case of page routes

    if (isAuthProtectedPageRoute) {
      // NOTE: Case of protected pages
      if (!refreshTokenCookie) {
        // NOTE: If refresh token is not included in the request, redirect to sign-in page

        const response = NextResponse.redirect(new URL(ROUTE_URL.auth.signIn, request.url));

        response.cookies.delete(COOKIE_KEY.autoSignIn);

        return response;
      }
    }

    if (isUnAuthProtectedPageRoute) {
      // NOTE: Case of unprotected pages
      if (refreshTokenCookie) {
        // NOTE: If refresh token is included in the request, redirect to home page

        return NextResponse.redirect(new URL(ROUTE_URL.home, request.url));
      }
    }
  }

  // NOTE: Other case, just pass the request
  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicons).*)'],
};
