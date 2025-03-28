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
  Put,
  Delete,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as moment from 'moment';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  FileValidationPipe,
  videoFileFilter,
  videoStorage,
} from '../utils/multer.config';
import { CreateVideoDto } from './dto/movie.dto';
import { CreateVideoLinkDto } from './dto/movie_link.dto';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';
import { PaginationDTO } from './dto/pagination.dto';
import { UpdateVideoDto } from './dto/UpdateVideo.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('video', {
      storage: videoStorage,
      fileFilter: videoFileFilter,
    }),
  )
  createMovie(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<Movie> {
    return this.movieService.createMovie(createVideoDto, file.filename);
  }

  @Put(':movieId')
  @UseInterceptors(FileInterceptor('video', { storage: videoStorage, fileFilter: videoFileFilter }))
  async updateMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Body() updateDto: UpdateVideoDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    let filePath: string = '';
    if(file) {
      filePath = file.filename;
    }
    const movie = await this.movieService.findByMovieAndUpdate(movieId, updateDto, filePath);
    return res.status(200).json(movie);  
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

  @Get(':movieId')
  async getMovieId(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Res() res: Response,
  ) {
    const movie = await this.movieService.getMovieById(movieId);
    return res.status(HttpStatus.OK).json(movie);
  }

  @Get()
  async getMovies(@Query() paginationDTO: PaginationDTO, @Res() res: Response) {
    const movies = await this.movieService.getAllMovies(paginationDTO);
    return res.status(HttpStatus.OK).json(movies);
  }

  @Delete(':movieId')
  async deleteMovie(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Res() res: Response,
  ) {
    await this.movieService.deleteMovie(movieId);
    return res
      .status(HttpStatus.OK)
      .json({ success: true, message: 'Movie deleted successfully' });
  }
}
