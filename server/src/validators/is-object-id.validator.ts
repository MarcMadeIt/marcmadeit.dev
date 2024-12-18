import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { isObjectIdOrHexString } from 'mongoose';

export function IsObjectId(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isObjectId',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return isObjectIdOrHexString(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid ObjectId`;
        },
      },
    });
  };
}
