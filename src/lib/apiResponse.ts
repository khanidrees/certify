import { NextResponse } from 'next/server';

interface ApiResponseOptions {
  message: string;
  data?: unknown;
  error?: unknown;
}

/** 200 OK */
export function ok(opts: ApiResponseOptions) {
  return NextResponse.json(
    { success: true, message: opts.message, data: opts.data ?? null },
    { status: 200 }
  );
}

/** 201 Created */
export function created(opts: ApiResponseOptions) {
  return NextResponse.json(
    { success: true, message: opts.message, data: opts.data ?? null },
    { status: 201 }
  );
}

/** 400 Bad Request */
export function badRequest(opts: ApiResponseOptions) {
  return NextResponse.json(
    { success: false, message: opts.message, error: opts.error ?? null },
    { status: 400 }
  );
}

/** 401 Unauthorized */
export function unauthorized(opts?: Partial<ApiResponseOptions>) {
  return NextResponse.json(
    { success: false, message: opts?.message ?? 'Unauthorized', error: null },
    { status: 401 }
  );
}

/** 403 Forbidden */
export function forbidden(opts?: Partial<ApiResponseOptions>) {
  return NextResponse.json(
    { success: false, message: opts?.message ?? 'Forbidden', error: null },
    { status: 403 }
  );
}

/** 404 Not Found */
export function notFound(opts?: Partial<ApiResponseOptions>) {
  return NextResponse.json(
    { success: false, message: opts?.message ?? 'Not found', error: null },
    { status: 404 }
  );
}

/** 409 Conflict */
export function conflict(opts: ApiResponseOptions) {
  return NextResponse.json(
    { success: false, message: opts.message, error: opts.error ?? null },
    { status: 409 }
  );
}

/** 500 Internal Server Error */
export function internalError(opts?: Partial<ApiResponseOptions>) {
  return NextResponse.json(
    {
      success: false,
      message: opts?.message ?? 'Internal server error',
      error: null,
    },
    { status: 500 }
  );
}
