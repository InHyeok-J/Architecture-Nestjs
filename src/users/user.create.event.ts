import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs.event';

export class UserCreateEvent extends CqrsEvent implements IEvent {
  constructor(readonly email: string, readonly signupVerifyToken: string) {
    super(UserCreateEvent.name);
  }
}
