import { INestApplication } from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';

export interface Request extends FastifyRequest {
  /**
   * Get all inputs from the request object
   */
  all(): Record<string, any>;

  /**
   * Get the current user from the request object
   */
  user: any;
}

export interface Response extends FastifyReply {
  success(
    data: Record<string, any> | Array<any> | string,
    status?: number | string,
    message?: string,
  ): Response;

  error(
    error: Record<string, any> | string,
    status?: number | string,
  ): Response;

  noContent(): Response;

  withMeta(data: Record<string, any>, status?: number | string): Response;

  onlyData(
    data: Promise<Record<string, any> | Array<any> | string>,
    status?: number | string,
  ): Promise<Record<string, any>>;

  withMeta(
    data: Promise<Record<string, any>>,
    status?: number | string,
  ): Promise<Record<string, any>>;
}

export interface ServerOptions<T> {
  addValidationContainer?: boolean;
  port?: number;
  globalPrefix?: string;
  enableSwagger?: boolean;
  initAdapters?: (app: T) => Promise<void>;
}

export const RestApiHeaders = {
  DEVICE_HASH: 'device-hash',
  APP_VERSION: 'app-version',
  DEVICE_LANG: 'device-lang',
  TIMEZONE: 'time-zone',
  DEVICE_OS: 'device-os',
  API_SECRET: 'api-secret',
};
