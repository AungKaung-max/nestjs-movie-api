import {
  Controller,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateVideoDto } from './dto/movie.dto';
import { Movie } from './entities/movie.entity';
import { Post, Body, ParseFilePipeBuilder } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from '../utils/multer.config';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import * as moment from 'moment';

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
    }),
  )
  create(
    @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    @Body() createVideoDto: CreateVideoDto,
  ): Promise<Movie> {
    createVideoDto.video = file.filename;

    return this.movieService.create(createVideoDto);
  }
}
