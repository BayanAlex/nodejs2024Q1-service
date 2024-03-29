import { Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [PrismaModule, LoggingModule],
  controllers: [AlbumsController],
  providers: [AlbumsService],
})
export class AlbumsModule {}
