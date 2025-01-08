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
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

import { EmployeeObjetiveService } from '../service/employee_objective.service';
import {
  CreateEmployeeObjectiveDto,
  UpdateObjectiveDTO,
  UpdateDncCourseDto,
  UpdateDncCourseManualDto,
  UpdateEmployeeObjectiveDtoPartial,
  UpdateDefinitionObjectiveAnnualDto,
  UpdateDefinitionObjectiveAnnualEvaluadtionLeaderDto
} from '../dto/create_employee_objective.dto';
import { Views } from '../../auth/decorators/views.decorator';
import { RoleGuard } from '../../auth/guards/role.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { writeFile } from 'fs';
import { el } from 'date-fns/locale';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Objetivos de  Empleado')
@Controller('employee-objective')
export class EmployeeObjetiveController {
  constructor(private employeeObjetiveService: EmployeeObjetiveService) {}
  status = {
    code: 200,
    message: 'OK',
    error: false,
    data: {},
    status: 'success',
  };

  @ApiOperation({ summary: 'se asignan los objetivos de empleado' })
  @Post()
  async create(
    @Body() currData: CreateEmployeeObjectiveDto,
    @CurrentUser() user: any,
  ) {
    return this.employeeObjetiveService.create(currData, user);
  }

  @ApiOperation({ summary: 'se asignan los objetivos de empleado de manera parcial'})
  @Post('partial')
  async createDefinitionObjectiveAnnualPartial(
    @Body() currData: UpdateEmployeeObjectiveDtoPartial,
    @CurrentUser() user: any,
  ) {
    return this.employeeObjetiveService.createDefinitionObjectiveAnnual(
      currData,
      user,
    );
  }

  @ApiOperation({ summary: 'Acceso a la vista para definir objetivos, ademas se verifica si el empleado tiene objetivos asignados'})
  @Get()
  @Views('definir_objetivo')
  findAll(@Query() currData: any, @CurrentUser() user: any) {
    if (currData.action == 'acceso') {
      return this.status;
    } else {
      return this.employeeObjetiveService.findAll(currData, user);
    }
  }

  @ApiOperation({
    summary: 'Obtiene todos los objetivos de un empleado por id de objetivo',
  })
  @Get(':id')
  async findObjectiveEmployee(@Param('id', ParseIntPipe) id: number) {
    const status = {
      code: 200,
      message: 'OK',
      error: false,
      definitionObjectiveAnnual: {},
      status: 'success',
    };
    const result = await this.employeeObjetiveService.findObjectiveEmployee(id);
    if (result.status.status == 'success') {
      status.message = result.status.message;
      status.definitionObjectiveAnnual = result.definitionObjectiveAnnual;
      return status;
    } else {
      this.status.code = 400;
      this.status.message = 'No se encontraron datos';
      this.status.error = true;
      this.status.status = 'error';
      return this.status;
    }
  }

  @ApiOperation({ summary: 'Obtiene el documento pdf de los objetivos' })
  @Get('pdf/:id')
  async downloadPdf(@Res() res: Response, @Query() currData: any) {
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=objetivos.pdf',
    });

    try {
      const pdfStream = await this.employeeObjetiveService.downloadPdf(
        currData,
      );
      pdfStream.pipe(res);

      return pdfStream;
    } catch (error) {
      console.error(error);
    }
  }

  @ApiOperation({
    summary: 'Obtiene todos los objetivos de un empleado por id de empleado',
  })
  @Get('employee/:idEmployee/:year')
  async findOneByEmployeeAndYear(
    @Param('idEmployee', ParseIntPipe) id: number,
    @Param('year', ParseIntPipe) year: number,
  ) {
    return this.employeeObjetiveService.findOneByEmployeeAndYear(id, year);
  }

  @ApiOperation({ summary: 'Se Actualizan los objetivos de un empleado' })
  @Put()
  async updateObjective(@Body() currData: any, @CurrentUser() user: any) {
    const status = {
      code: 200,
      message: 'OK',
      error: false,
      data: {},
      status: 'success',
    };
    switch (currData.action) {
      case 'updateCommentEdit':
        const dataDefinition: UpdateObjectiveDTO = currData.employeeObjective;
        const result1 =
          await this.employeeObjetiveService.updateDefinitionObjective(
            currData.id,
            dataDefinition,
            user,
          );

        status.code = result1.code;
        status.error = result1.error;
        status.status = result1.status;
        status.message = result1.message;
        status.data = result1.data;
        break;
      case 'updateObjective':
        const dataObjecyive: UpdateObjectiveDTO = currData.employeeObjective;
        const result2 = await this.employeeObjetiveService.updateObjective(
          dataObjecyive.id,
          dataObjecyive,
          user,
        );

        status.code = result2.code;
        status.error = result2.error;
        status.status = result2.status;
        status.message = result2.message;
        status.data = result2.data;
        break;
      case 'updateDnc':
        const dataDnc: UpdateDncCourseDto = currData.dncCourse;
        const result3 = await this.employeeObjetiveService.updateDnc(
          dataDnc.id,
          dataDnc,
          user,
        );

        status.code = result3.code;
        status.error = result3.error;
        status.status = result3.status;
        status.message = result3.message;
        status.data = result3.data;
        break;
      case 'updateDncManual':
        const dataDncManual: UpdateDncCourseManualDto =
          currData.dncCourseManual;

        const result4 = await this.employeeObjetiveService.updateDncManual(
          dataDncManual.id,
          dataDncManual,
          user,
        );

        status.code = result4.code;
        status.error = result4.error;
        status.status = result4.status;
        status.message = result4.message;
        status.data = result4.data;
        break;
      default:
        break;
    }
    return status;
  }

  @ApiOperation({
    summary: 'Se Elimina informacion de la asignacion de objetivos',
  })
  @Delete('partial')
  async deleteDetail(@Query() currData: any, @CurrentUser() user: any) {
    return this.employeeObjetiveService.deleteDetail(currData, user);
  }
}

@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Evaluacion de objetivos medio año')
@Controller('employee-objective/medio-anio')
export class EmployeeObjetiveMedioAnoController {
  constructor(private employeeObjetiveService: EmployeeObjetiveService) {}
  status = {
    code: 200,
    message: 'OK',
    error: false,
    data: {},
    status: 'success',
  };

  @ApiOperation({ summary: 'Acceso a la vista evaluación medio año'})
  @Get()
  findAll(@Query() currData: any, @CurrentUser() user: any) {
    if (currData.action == 'acceso') {
      return this.status;
    } else {
      return this.employeeObjetiveService.findAll(currData, user);
    }
  }

  @ApiOperation({ summary: 'Evaluacion de empleado medio y fin de año' })
  @Put(':id')
  async updateObjective(@Param('id', ParseIntPipe) id: number, @Body() currData: any, @CurrentUser() user: any) {
    
    switch (currData.action) {
      //evaluacion medio año empleado
      case 'updateEvaluationEmployee':
        const dataDefinition: UpdateDefinitionObjectiveAnnualDto = currData.evaluacionEmployee;
        const result1 =
          await this.employeeObjetiveService.evaluationEmployeeMidYear(
            id,
            dataDefinition,
            user,
          );
        this.status.code = result1.code;
        this.status.error = result1.error;
        this.status.status = result1.status;
        this.status.message = result1.message;
        this.status.data = result1.data;
        break;
      //evaluacion medio año lider
      case 'updateEvaluationLeader':
        const dataObjective: UpdateDefinitionObjectiveAnnualEvaluadtionLeaderDto = currData.evaluacionEmployee;
        const result2 = await this.employeeObjetiveService.evaluationLeaderMidYear(
          id,
          dataObjective,
          user,
        );

        this.status.code = result2.code;
        this.status.error = result2.error;
        this.status.status = result2.status;
        this.status.message = result2.message;
        this.status.data = result2.data;
        break;
      case 'EditEvaluationCommentLeader':
        const dataDnc: UpdateDncCourseDto = currData.dncCourse;
        const result3 = await this.employeeObjetiveService.updateDnc(
          dataDnc.id,
          dataDnc,
          user,
        );

        this.status.code = result3.code;
        this.status.error = result3.error;
        this.status.status = result3.status;
        this.status.message = result3.message;
        this.status.data = result3.data;
        break;
      //evaluacion fin de año empleado
      case 'updateEvaluationEndYearEmployee':
        const dataDefinitionFin: UpdateDefinitionObjectiveAnnualDto = currData.evaluacionEmployee;
        
        const resultFin =
          await this.employeeObjetiveService.evaluationEmployeeEndYear(
            id,
            dataDefinitionFin,
            user,
          );
        this.status.code = resultFin.code;
        this.status.error = resultFin.error;
        this.status.status = resultFin.status;
        this.status.message = resultFin.message;
        this.status.data = resultFin.data;
        break;
      //evaluacion fin año lider
      case 'updateEvaluationEndYearLeader':
        const dataObjectiveEnd: UpdateDefinitionObjectiveAnnualEvaluadtionLeaderDto = currData.evaluacionEmployee;
        const result2End = await this.employeeObjetiveService.evaluationLeaderEndYear(
          id,
          dataObjectiveEnd,
          user,
        );

        this.status.code = result2End.code;
        this.status.error = result2End.error;
        this.status.status = result2End.status;
        this.status.message = result2End.message;
        this.status.data = result2End.data;
        break;
      default:
        break;
    }
    return this.status;
  }

  
}
