import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  Res,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import { DocumentClasificationDto } from '../dto/document_clasification.dto';
import { DocumentClasification } from '../entities/document_clasification.entity';
import { DocumentClasificationService } from '../service/document_clasification.service';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Clasificacion de documentos')
@Controller('document-clasification')
export class DocumentClasificationController {
  constructor(
    private documentClasificationService: DocumentClasificationService,
  ) {}

  @ApiOperation({
    summary: 'Acceso a la vista para cargar documentos de empleados',
  })
  @Views('documentos-empleado')
  @Get()
  getDocuments() {
    return this.documentClasificationService.findAll();
  }

  @ApiOperation({ summary: 'Obtiene el documento pdf de los objetivos' })
  @Get('file/:id')
  async downloadFile(@Res() res: Response, @Param('id') id: number) {
    /* res.writeHead(200, {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=objetivos.pdf',
          
      }); */

    try {
      const filePath = await this.documentClasificationService.getFilePath(id);
      /* res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${filePath.fileName}`); */
      res.set(
        'Content-Disposition',
        `attachment; filename="${filePath.fileName}"`,
      );
      res.download(filePath.path, filePath.fileName);
    } catch (error) {
      console.error(error);
    }
  }

  @ApiOperation({ summary: 'Consulta documentos por empleado' })
  @Get('employee/:id')
  getDocumentsEmployee(@Param('id', ParseIntPipe) id: number) {
    return this.documentClasificationService.findByIdsEmployee([id]);
  }

  @ApiOperation({
    summary: 'Crear clasificacion de documentos y subir archivos',
  })
  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files', 100)) //100 numero de archivos maximo
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.documentClasificationService.uploadFile(files);
  }
}
