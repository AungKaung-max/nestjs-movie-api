import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as moment from 'moment';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileValidationPipe } from '../utils/multer.config';
import { CreateVideoDto } from './dto/movie.dto';
import { CreateVideoLinkDto } from './dto/movie_link.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { PaginationDTO } from './dto/pagination.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => {
          if (file) {
            const dateFormatted = moment().format('YYYY_M_D');
            const fileExtension = path.extname(file.originalname);
            const fileName = `${dateFormatted}_${uuidv4()}${fileExtension}`;
            callback(null, fileName);
          }
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(mp4)$/)) {
          callback(null, true);
        } else {
          return callback(
            new BadRequestException('Only MP4 files are allowed!'),
            false,
          );
        }
      },
    }),
  )
  createMovie(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<Movie> {
    return this.movieService.createMovie(createVideoDto, file.filename);
  }

  @Post('/:movieId/links')
  async addMovieLinks(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() createMovieLinkDtos: CreateVideoLinkDto[],
    @Res() res: Response,
  ) {
    const movieLinks = await this.movieService.addMovieLink(
      movieId,
      createMovieLinkDtos,
    );

    const response = {
      success: true,
      data: movieLinks.map((data) => ({
        id: data.id,
        title: data.title,
        link: data.link,
        created_at: data.created_at,
        updated_at: data.updated_at,
      })),
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Get()
  async getMovies(@Query() paginationDTO: PaginationDTO, @Res() res: Response) {
    const movies = await this.movieService.getAllMovies(paginationDTO);
    return res.status(HttpStatus.OK).json(movies);
  }
}
