import { AuthGuard } from '@nestjs/passport';

export class SessionGuard extends AuthGuard('session') {
  constructor() {
    super();
  }
}
