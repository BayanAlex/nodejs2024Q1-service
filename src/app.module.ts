import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FavoritesModule } from './endpoints/favorites/favorites.module';
import { AlbumsModule } from './endpoints/albums/albums.module';
import { ArtistsModule } from './endpoints/artists/artists.module';
import { TracksModule } from './endpoints/tracks/tracks.module';
import { UsersModule } from './endpoints/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { LoggingModule } from './logging/logging.module';
import { LoggingMiddleware } from './logging/logging.middleware';
import { AuthModule } from './endpoints/auth/auth.module';

@Module({
  imports: [
    AlbumsModule,
    ArtistsModule,
    FavoritesModule,
    TracksModule,
    UsersModule,
    PrismaModule,
    LoggingModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
