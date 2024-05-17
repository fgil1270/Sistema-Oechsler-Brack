import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from 'multer';

import { DocumentEmployeeService } from '../service/document_employee.service';
import { CreateDocumentEmployeeDto } from '../dto/document_employee.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { User } from '../../users/entities/user.entity';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('documentos de empleado')
@Controller('document-employee')
export class DocumentEmployeeController {
  constructor(private documentEmployeeService: DocumentEmployeeService) {}
}
