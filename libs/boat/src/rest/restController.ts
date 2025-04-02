import { Controller, Get, Res } from '@nestjs/common';
import { Transformable } from '../transformers/transformable';
import { Response } from './interfaces';

@Controller('health')
export class RestController extends Transformable {
  @Get('status')
  getHealthCheck(@Res() res: Response) {
    return res.success({});
  }
}
