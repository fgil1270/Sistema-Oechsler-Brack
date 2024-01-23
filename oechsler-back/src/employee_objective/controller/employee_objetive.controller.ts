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
    UseGuards,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

import { EmployeeObjetiveService } from '../service/employee_objective.service';
import { CreateEmployeeObjectiveDto } from '../dto/create_employee_objective.dto';
import { Views } from "../../auth/decorators/views.decorator";
import { RoleGuard } from "../../auth/guards/role.guard";
import { CurrentUser } from '../../auth/decorators/current-user.decorator';


@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Objetivos de  Empleado')
@Controller('employee-objective')
export class EmployeeObjetiveController {}
