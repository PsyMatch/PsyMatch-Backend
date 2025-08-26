import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPasswordHelper implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    const object = args.object as Record<string, unknown>;
    const propertyToMatch = args.constraints[0] as string;
    if (password !== object[propertyToMatch]) return false;
    return true;
  }

  defaultMessage() {
    return "Las contraseñas no coinciden";
  }
}
