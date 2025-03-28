import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { movieProviders } from './entities/movie.providers';
import { movieLinkProviders } from './entities/movie_link.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MoviesController],
  providers: [...movieProviders, ...movieLinkProviders, MoviesService],
})
export class MoviesModule {}
