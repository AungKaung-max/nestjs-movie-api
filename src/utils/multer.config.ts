import {
  HttpStatus,
  Injectable,
  ParseFilePipeBuilder,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import * as moment from 'moment';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File) {
    const pipe = new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'video/mp4',
      })
      .addMaxSizeValidator({
        maxSize: 100000000,
      })
      .build({
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      });

    return pipe.transform(value);
  }
}

export const videoStorage = diskStorage({
  destination: './upload',
  filename: (req, file, callback) => {
    if (file) {
      const dateFormatted = moment().format('YYYY_M_D');
      const fileExtension = path.extname(file.originalname);
      const fileName = `${dateFormatted}_${uuidv4()}${fileExtension}`;
      callback(null, fileName);
    }
  },
});

export const videoFileFilter = (req, file, callback) => {
  if (file.mimetype.match(/\/(mp4)$/)) {
    callback(null, true);
  } else {
    return callback(
      new BadRequestException('Only MP4 files are allowed!'),
      false,
    );
  }
};
