import { EamilService } from '../../infra/adapter/email.service';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreateEvent } from '../../domain/user.create.event';

@EventsHandler(UserCreateEvent)
export class UserEventHandler implements IEventHandler<UserCreateEvent> {
  constructor(private emailService: EamilService) {}

  async handle(event: UserCreateEvent) {
    switch (event.name) {
      case UserCreateEvent.name: {
        console.log('UserCreateEvnet !! ');
        const { email, signupVerifyToken } = event as UserCreateEvent;
        await this.emailService.sendMemberJointVerfication(
          email,
          signupVerifyToken,
        );
        break;
      }
      default:
        break;
    }
  }
}
