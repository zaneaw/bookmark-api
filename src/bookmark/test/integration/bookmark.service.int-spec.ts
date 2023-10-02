import { Test } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from '../../../auth/auth.service';

describe('BookmarkService Int', () => {
  let prisma: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    authService = moduleRef.get(AuthService);
    await prisma.cleanDb();
  });

  describe('createBookmark', () => {
    const userDto = {
      email: 'zane@gmail.com',
      password: 'password',
    };
    let userId: number;

    it('should create a user', async () => {
      const user = await authService.signup(userDto);
      console.log(user);
      expect(user.access_token).toBeDefined();
    });

    it('should get user id', async () => {
      const user = await prisma.user.findUnique({
        where: {
          email: userDto.email,
        },
      });

      console.log(user);

      userId = user.id;

      console.log(userId);
    });

    it('should create a bookmark', async () => {
      const bookmark = await prisma.bookmark.create({
        data: {
          title: 'Google',
          link: 'https://google.com',
          userId,
        },
      });

      console.log(bookmark);
    });
  });

  describe('updateBookmark', () => {
    it.todo('updates a bookmark');
  });
});
