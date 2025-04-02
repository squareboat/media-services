import { getPayloadFromHost, getReqClientFromHost } from '@libs/boat/utils';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Logger } from '@squareboat/nest-console';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class RestApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const debugInfo = [];

    const payload = getPayloadFromHost(context);
    const reqClient = getReqClientFromHost(context);

    debugInfo.push({
      type: 'URL',
      value: reqClient.url,
    });

    debugInfo.push({
      type: 'Request Headers',
      value: JSON.stringify(reqClient.headers),
    });

    debugInfo.push({
      type: 'Request Payload',
      value: JSON.stringify(payload),
    });

    const onRequestCompleteTap = (data) => {
      debugInfo.push({
        type: 'Response',
        value: JSON.stringify(data),
      });
      debugInfo.push({
        type: 'Time to Respond',
        value: `${Date.now() - now}ms`,
      });

      Logger.table(debugInfo);
    };

    return next.handle().pipe(tap(onRequestCompleteTap));
  }
}
