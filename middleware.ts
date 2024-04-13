import { NextRequest, NextResponse } from 'next/server';

import { NotFound } from '@/(error)';

import { COOKIE_KEY, ROUTE_URL } from '@/constant';
import { SERVER_SETTINGS } from '@/setting';

const CORS_OPTIONS = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// NOTE: On middleware part, access token and refresh token must set in cookies.
export const middleware = async (request: NextRequest) => {
  const PROTECTED_PAGE_ROUTE = /^(\/user\/me|\/post\/create)/;

  const isAPIRoute = request.nextUrl.pathname.startsWith(SERVER_SETTINGS.API_PREFIX);
  const isAuthAPIRoute = request.nextUrl.pathname.startsWith(
    `${SERVER_SETTINGS.API_PREFIX}${ROUTE_URL.auth.prefix}`
  );
  const isAuthPageRoute = request.nextUrl.pathname.startsWith(ROUTE_URL.auth.prefix);
  const isProtectedPageRoute = PROTECTED_PAGE_ROUTE.test(request.nextUrl.pathname);

  const accessTokenCookie = request.cookies.get(COOKIE_KEY.accessToken);
  const refreshTokenCookie = request.cookies.get(COOKIE_KEY.refreshToken);

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

    if (!isAuthAPIRoute && !refreshTokenCookie && accessTokenCookie) {
      // NOTE: When go to api route handlers and if the access token is not included but refresh token is included in the request, the refresh token is deleted on the server side.

      request.cookies.delete(COOKIE_KEY.accessToken);

      const requestHeaders = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      response.cookies.delete(COOKIE_KEY.accessToken);
      response.cookies.delete(COOKIE_KEY.autoSignIn);
      response.cookies.delete(COOKIE_KEY.auth);

      return response;
    }
  } else {
    if (isAuthPageRoute) {
      // NOTE: Case of auth pages
      if (refreshTokenCookie) {
        // NOTE: When go to auth pages, if the refresh token is included in the request, redirect to home page.

        return NextResponse.redirect(new URL(ROUTE_URL.home, request.url));
      } else {
        if (accessTokenCookie) {
          // NOTE: When go to auth pages, if the access token is included in the request, redirect to home page.

          request.cookies.delete(COOKIE_KEY.accessToken);

          const requestHeaders = new Headers(request.headers);

          const response = NextResponse.next({ request: { headers: requestHeaders } });

          response.cookies.delete(COOKIE_KEY.accessToken);
          response.cookies.delete(COOKIE_KEY.autoSignIn);
          response.cookies.delete(COOKIE_KEY.auth);

          return response;
        }
      }
    }

    if (isProtectedPageRoute) {
      // NOTE: Case of protected pages
      if (refreshTokenCookie) {
        // NOTE: When go to protected pages, if the refresh token is included in the request, just pass the request
        return NextResponse.next();
      } else {
        // NOTE: When go to protected pages, if the refresh token is not included in the request but access token is included, redirect to sign in page.

        const response = NextResponse.redirect(new URL(ROUTE_URL.auth.signIn, request.url));

        if (accessTokenCookie) {
          request.cookies.delete(COOKIE_KEY.accessToken);

          response.cookies.delete(COOKIE_KEY.accessToken);
          response.cookies.delete(COOKIE_KEY.autoSignIn);
          response.cookies.delete(COOKIE_KEY.auth);
        }

        return response;
      }
    }
  }

  // NOTE: Other case, just pass the request
  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicons).*)'],
};
