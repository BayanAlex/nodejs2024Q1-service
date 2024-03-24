import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FavoritesModule } from './favorites/favorites.module';
import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingModule } from './logging/logging.module';
import { LoggingMiddleware } from './logging/logging.middleware';

@Module({
  imports: [
    AlbumsModule,
    ArtistsModule,
    FavoritesModule,
    AlbumsModule,
    ArtistsModule,
    TracksModule,
    UsersModule,
    PrismaModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
