import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @Inject('MOVIE_REPOSITORY') private movieRepository: Repository<Movie>,
  ) {}

  async create(movieDto: CreateVideoDto): Promise<Movie> {
    const movie = this.movieRepository.create(movieDto);
    return this.movieRepository.save(movie);
  }
}
