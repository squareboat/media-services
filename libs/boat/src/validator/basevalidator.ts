import { startCase, isEmpty } from 'lodash';
import { ValidationError, validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { ArgumentsHost, Injectable, Type } from '@nestjs/common';
import { ValidationFailed } from '../exceptions';
// import { WsValidationFailed } from '../exceptions/wsValidationFailed';

@Injectable()
export class BaseValidator {
  host: ArgumentsHost;

  setHost(host: ArgumentsHost) {
    this.host = host;
  }

  async fire<T>(inputs: Record<string, any>, schemaMeta: Type<T>): Promise<T> {
    const schema: T = plainToClass(schemaMeta, inputs);
    const errors = await validate(schema as Record<string, any>, {
      stopAtFirstError: true,
    });

    this.processErrorsFromValidation(errors);

    return schema;
  }

  /**
   * Process errors, if any.
   * Throws new ValidationFailed Exception with validation errors
   */
  processErrorsFromValidation(errors: ValidationError[]): void {
    let bag = {};
    if (errors.length > 0) {
      for (const error of errors) {
        const errorsFromParser = this.parseError(error);
        const childErrorBag = {};
        for (const key in errorsFromParser) {
          if (!isEmpty(errorsFromParser[key])) {
            childErrorBag[key] = errorsFromParser[key];
          }
        }

        bag = { ...bag, ...childErrorBag };
      }

      this.throwErrorToHost(bag);
      throw new ValidationFailed(bag);
    }
  }

  throwErrorToHost(bag: Record<string, any>): void {
    if (!this.host) {
      throw new ValidationFailed(bag);
    }

    const contextType = this.host['contextType'];

    if (contextType === 'ws') {
      // throw new WsValidationFailed(bag);
    }

    throw new ValidationFailed(bag);
  }

  parseError(error) {
    const children = [];
    for (const child of error.children || []) {
      children.push(this.parseError(child));
    }

    const messages = [];
    for (const c in error.constraints) {
      let message = error.constraints[c];
      message = message.replace(error.property, startCase(error.property));
      messages.push(message);
    }

    const errors = {};
    if (!isEmpty(messages)) {
      errors[error.property] = messages;
    }

    for (const child of children) {
      for (const key in child) {
        errors[`${error.property}.${key}`] = child[key];
      }
    }

    return errors;
  }
}
