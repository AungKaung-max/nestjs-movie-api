import {
  HttpStatus,
  Injectable,
  ParseFilePipeBuilder,
  PipeTransform,
} from '@nestjs/common';

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
