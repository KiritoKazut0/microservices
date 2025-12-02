import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

import zxcvbn from 'zxcvbn-typescript';

@ValidatorConstraint({ name: 'IsValidPassword', async: false })
export class IsValidPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    if (typeof password !== 'string') return false;

    const result = zxcvbn(password);
    return result.score >= 2;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La contraseña es demasiado débil. Usa una más compleja.';
  }
}

export function IsValidPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      validator: IsValidPasswordConstraint,
      options: validationOptions,
    });
  };
}
