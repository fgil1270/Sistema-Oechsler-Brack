import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';


@ApiTags('Controlador General')
@Controller('general')
export class GeneralController {
  constructor() { }

  @ApiOperation({ summary: 'Descargar archivos' })
  @Get('download-file')
  async downloadFile(
    @Res() res: Response,
    @Query('path') path: string,
    @Query('filename') filename: string,
  ) {
    try {
      res.set('Content-Disposition', `attachment; filename="${filename}"`);
      let ruta = join(
        __dirname,
        `../../${path}`,
        filename,
      )
      res.download(ruta, filename);
    } catch (error) {
      res.status(404).send('Archivo no encontrado');
    }
  }
}
