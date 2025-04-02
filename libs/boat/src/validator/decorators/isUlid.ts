import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: true })
class IsUlidConstraint implements ValidatorConstraintInterface {
  async validate(value: string, args: ValidationArguments) {
    const regex = new RegExp(/[0-7][0-9A-HJKMNP-TV-Z]{25}/);
    return regex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    const property = args.property;
    return `${property} should be a valid ULID`;
  }
}

export function IsUlid(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUlidConstraint,
    });
  };
}
