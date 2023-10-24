import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  getBookmarks(userId: number) {
    const bookmarks = this.prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
    });
    return bookmarks;
  }

  getBookmarkById(userId: number, bookmarkId: number) {
    const bookmark = this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
        userId: userId,
      },
    });
    if (Object.keys(bookmark).length === 0) {
      console.log('emtpy');
      throw new NotFoundException('Bookmark not found');
    }

    return bookmark;
  }

  createBookmark(userId: number, createDto: CreateBookmarkDto) {
    return this.prisma.bookmark.create({
      data: {
        userId: userId,
        ...createDto,
      },
    });
  }

  editBookmark(userId: number, dto: EditBookmarkDto, id: number) {
    return this.prisma.bookmark.update({
      where: {
        id: id,
        userId: userId,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteBookmark(userId: number, id: number) {
    return this.prisma.bookmark.delete({
      where: {
        id: id,
        userId: userId,
      },
    });
  }
}
