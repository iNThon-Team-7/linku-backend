import { ValidationError } from '@nestjs/common';

export class ValidationException extends Error {
  constructor(errors: ValidationError[]) {
    super(
      'Validation failure occurred: \n' +
        errors.map((e) => e.toString()).join(''),
    );
  }
}
