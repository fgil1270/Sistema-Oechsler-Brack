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
import { error } from 'console';


@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Objetivos de  Empleado')
@Controller('employee-objective')
export class EmployeeObjetiveController {
    constructor(
        private employeeObjetiveService: EmployeeObjetiveService
    ) {}
    
    @ApiOperation({ summary: 'Crea un objetivo de empleado' })
    @Post()
    @Views('employee-objective', 'create')
    async create(
        @Body() currData: CreateEmployeeObjectiveDto,
        @CurrentUser() user: any
    ){
        return this.employeeObjetiveService.create(currData, user);
    }

    @ApiOperation({ summary: 'Obtiene todos los objetivos de empleado' })
    @Get()
    @Views('definir_objetivo')
    findAll(@Query() currData: any, @CurrentUser() user: any){
        let status = {code: 200, message: 'OK', error: false};
        
        if(currData.action == 'acceso'){
               return status;
        }else{
            
            return this.employeeObjetiveService.findAll(currData, user);
        }

        
    }

    /* @ApiOperation({ summary: 'Obtiene todos los objetivos de empleado de un empleado' })
    @Get('employee/:id')
    @Views('employee-objective', 'read')
    async findAllByEmployee(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.employeeObjetiveService.findAllByEmployee(id);
    }

    @ApiOperation({ summary: 'Obtiene todos los objetivos de empleado de un empleado' })
    @Get('employee/:id/evaluation')
    @Views('employee-objective', 'read')
    async findAllByEmployeeEvaluation(
        @Param('id', ParseIntPipe) id: number
    ){
        return this.employeeObjetiveService.findAllByEmployeeEvaluation(id);
    }

    @ApiOperation({ summary: 'Obtiene todos los objetivos de empleado de un empleado' })
    @Get('employee/:id/evaluation/:evaluationId')
    @Views('employee-objective', 'read')
    async findAllByEmployeeEvaluationId(
        @Param('id', ParseIntPipe) id: number,
        @Param('evaluationId', ParseIntPipe) evaluationId: number
    ){
        return this.employeeObjetiveService.findAllByEmployeeEvaluationId(id, evaluationId);
    }

    @ApiOperation({ summary: 'Obtiene todos los objetivos de empleado de un empleado' })
    @Get('employee/:id/evaluation/:evaluationId/evaluation-objective')
    @Views('employee-objective', 'read')
    async findAllByEmployeeEvaluationIdEvaluationObjective(
        @Param('id', ParseIntPipe) id: number,
        @Param('evaluationId', ParseIntPipe) evaluationId: number
    ){
        return this.employeeObj;
    } */
}
