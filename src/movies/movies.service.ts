import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateVideoDto } from './dto/movie.dto';
import { CreateVideoLinkDto } from './dto/movie_link.dto';
import { PaginationDTO } from './dto/pagination.dto';
import { Movie } from './entities/movie.entity';
import { MovieLink } from './entities/movie_link.entity';
import { Like } from 'typeorm';
import { UpdateVideoDto } from './dto/UpdateVideo.dto';

@Injectable()
export class MoviesService {
  constructor(
    @Inject('MOVIE_REPOSITORY') private movieRepository: Repository<Movie>,

    @Inject('MOVIE_LINK_REPOSITORY')
    private movieLinkRepository: Repository<MovieLink>,
  ) {}

  async createMovie(
    movieDto: CreateVideoDto,
    videoPath: string,
  ): Promise<Movie> {
    const movie = new Movie();
    movie.title = movieDto.title;
    movie.description = movieDto.description || ' ';
    movie.user_id = movieDto.user_id;
    movie.video = videoPath;
    return this.movieRepository.save(movie);
  }

  async addMovieLink(
    movieId: number,
    movieLinkDto: CreateVideoLinkDto[],
  ): Promise<MovieLink[]> {
    const movie = await this.movieRepository.findOne({
      where: { id: movieId },
    });
    if (!movie) {
      throw new BadRequestException('movie Id is invalid');
    }
    const movieLinks = movieLinkDto.map((link) => {
      const movieLink = new MovieLink();
      movieLink.movie = movie;
      movieLink.title = link.title;
      movieLink.link = link.link;
      return movieLink;
    });
    return this.movieLinkRepository.save(movieLinks);
  }

  async getAllMovies(paginationDto: PaginationDTO) {
    const { skip, limit, title, description } = paginationDto;
    const condition: { title?: any; description?: any } = {};
    if (title) {
      condition.title = Like(`%${title}%`);
    }
    if (description) {
      condition.description = Like(`%${description}%`);
    }
    return await this.movieRepository.find({
      where: condition,
      skip,
      take: limit,
    });
  }

  async getMovieById(id: number) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['movie_link'],
    });
    if (!movie) {
      throw new BadRequestException('Invalid movie Id');
    }
    return movie;
  }

  async findByMovieAndUpdate(
    id: number,
    updateDto: UpdateVideoDto,
    videoPath: string,
  ) {
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['movie_link'],
    });

    if (!movie) {
      throw new BadRequestException('Invalid movie ID');
    }

    movie.title = updateDto.title || movie.title;
    movie.description = updateDto.description || movie.description;

    if (videoPath) {
      movie.video = videoPath;
    }

    const updatedMovie = await this.movieRepository.save(movie);

    return updatedMovie;
  }

  async deleteMovie(id: number) {
    const movie = await this.movieRepository.findOne({ where: { id } });
    if (!movie) {
      throw new BadRequestException('Invalid movie ID');
    }
    return await this.movieRepository.delete(id);
  }
}
