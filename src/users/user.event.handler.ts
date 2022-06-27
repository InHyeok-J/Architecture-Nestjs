import { EamilService } from './../email/email.service';
import { TestEvent } from './test.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreateEvent } from './user.create.event';

@EventsHandler(UserCreateEvent, TestEvent)
export class UserEventHandler
  implements IEventHandler<UserCreateEvent | TestEvent>
{
  constructor(private emailService: EamilService) {}

  async handle(event: UserCreateEvent | TestEvent) {
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
      case TestEvent.name: {
        console.log('Test Event!!');
        break;
      }
      default:
        break;
    }
  }
}
