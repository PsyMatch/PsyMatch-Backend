import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'MatchPassword', async: false })
export class MatchPassword implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (password !== (args.object as any)[args.constraints[0]]) return false;
    return true;
  }

  defaultMessage() {
    return "Passwords don't match";
  }
}
