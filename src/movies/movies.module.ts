import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { movieProviders } from './entities/movie.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MoviesController],
  providers: [...movieProviders, MoviesService],
})
export class MoviesModule {}
