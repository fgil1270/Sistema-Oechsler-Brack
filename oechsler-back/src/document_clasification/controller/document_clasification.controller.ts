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
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { FilesInterceptor } from '@nestjs/platform-express';

import { DocumentClasificationDto } from '../dto/document_clasification.dto';
import { DocumentClasification } from '../entities/document_clasification.entity';
import { DocumentClasificationService } from '../service/document_clasification.service';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Clasificacion de documentos')
@Controller('document-clasification')
export class DocumentClasificationController {

  constructor(
    private documentClasificationService: DocumentClasificationService
  ) { }

  @ApiOperation({ summary: 'Crear clasificacion de documentos' })
  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultipleFiles(@UploadedFiles() files: Express.Multer.File[]) {
    return this.documentClasificationService.uploadFile(files);
  }


}
