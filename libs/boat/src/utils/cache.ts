import { ExpParser } from '@libs/boat';

export class CacheKeys {
  static MOBILE_VERIFICATION_OTP = 'MOBILE_VERIFICATION_OTP';

  static ROUTE_MATRIX = 'ROUTE_MATRIX';
  static ROUTE_MATRIX_TTL = 43200;
  static GEOCODING_MATRIX = 'GEOCODING_MATRIX';
  static GEOCODING_MATRIX_TTL = 604800;

  static NOTIFICATION_PREFERENCE = '';

  static build(key: string, inputs?: Record<string, any>): string {
    const obj = inputs || {};
    obj['keyName'] = key;
    return ExpParser.buildFromObj(obj);
  }
}
