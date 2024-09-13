/*
https://docs.nestjs.com/controllers#controllers
*/
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

import { Views } from '../../auth/decorators/views.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Documentos de puesto de trabajo')
@Controller('job-document')
export class JobDocumentController {}
