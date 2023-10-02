import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  // get all bookmarks
  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId,
      },
    });

    return bookmarks;
  }

  // get specific bookmark
  async getBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    return bookmark;
  }

  // create bookmark
  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    const bookmark = await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });

    return bookmark;
  }

  // edit specific bookmark
  async editBookmark(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
    // get bookmark by id
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    if (!bookmark) {
      throw new ForbiddenException('Access to resource denied');
    }

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: dto,
    });
  }

  // delete specific bookmark
  async deleteBookmark(userId: number, bookmarkId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId,
      },
    });

    if (!bookmark) {
      throw new ForbiddenException('Access to resource denied');
    }

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });

    return null;
  }
}
