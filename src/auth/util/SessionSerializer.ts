import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { User } from '@prisma/client';

export class SessionSerializer extends PassportSerializer {
  constructor(private userService: UserService) {
    super();
  }

  // how to serialize user to DB
  serializeUser(user: User, done: (err, user: User) => void) {
    console.log('SERIALIZE USER: ', user);
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user: User) => void) {
    console.log('DESERIALIZE USER: ', user);
    const userDb = await this.userService.findUserById(user.id);

    if (!userDb) {
      return done(null, null);
    }

    return done(null, userDb);
  }
}
