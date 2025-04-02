import { BadRequestException } from '@nestjs/common';
import { GenericException, ValidationFailed } from '../exceptions';

// helper methods which can be used across the project for small general tasks.
export class ExceptionsHelper {
  /**
   * Function: throw generic exception if a condition satisfies.
   * @param condition boolean value
   * @param msg Exception message which will be thrown when condition is true.
   */
  static throwGenericIf(condition: boolean, msg: string): void {
    if (condition) throw new GenericException(msg);
  }

  /**
   * Function: exception if a condition satisfies.
   * @param condition boolean value
   * @param ex Exception which will be thrown when condition is true.
   */
  static throwIf(condition: boolean, ex: Error): void {
    if (condition) throw ex;
  }

  /**
   * Function: throw validation exception if a condition satisfies.
   * @param condition boolean value
   * @param msg validation messages which will be thrown when condition is true.
   */
  static throwValidationIf(condition: boolean, msg: Record<string, any>): void {
    if (condition) throw new ValidationFailed(msg);
  }

  /**
   * Function: throw bad request validation exception if a condition satisfies.
   * @param condition boolean value
   * @param msg validation messages which will be thrown when condition is true.
   */
  static throwBadRequestIf(condition: boolean, msg: string): void {
    if (condition) throw new BadRequestException(msg);
  }

  /**
   * Function: Check if the current environment is local.
   */
  static isLocal(): boolean {
    return process.env.APP_STAGE === 'local';
  }
}
