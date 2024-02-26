import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateEmployeeObjectiveDto } from '../dto/create_employee_objective.dto';
import { EmployeeObjective } from '../entities/objective.entity';
import { OrganigramaService } from '../../organigrama/service/organigrama.service';
import { PercentageDefinitionService } from '../../evaluation_annual/percentage_definition/service/percentage_definition.service';
import { PercentageDefinition } from '../../evaluation_annual/percentage_definition/entities/percentage_definition.entity';

@Injectable()
export class EmployeeObjetiveService {

    constructor(
        @InjectRepository(EmployeeObjective) private employeeObjective: Repository<EmployeeObjective>,
        private organigramaService: OrganigramaService,
        private percentageDefinitionService: PercentageDefinitionService
    ) { }

    async create(currData: CreateEmployeeObjectiveDto, user: any){

    }

    async findAll(currdata, user: any){
        let status = {code: 200, message: 'OK', error: false};
        let dataEmployee = [];
        
        const percentage = await this.percentageDefinitionService.findOne(currdata.idYear);
        //se obtienen los empleados por jerarquia
        const employee = await this.organigramaService.findJerarquia(
            {
              type: currdata.type,
              startDate: '',
              endDate: '',
            }, 
            user
        );
        
        for (let index = 0; index < employee.length; index++) {
            const element = employee[index];
            const employeeObjetive = await this.employeeObjective.find({
                relations: {
                    objectiveEvaluation: true,
                    definitionObjectiveAnnual: true,
                    
                },
                where: {
                    definitionObjectiveAnnual: {
                        employee: {
                            id: element.id
                        },
                        percentageDefinition: {
                            id: currdata.idYear
                        }
                    }
                    
                }
            });

            let noDefinido = employeeObjetive.some((objetive) => objetive.status == 'No definido');

            
            dataEmployee.push({
                employee: element,
                status: noDefinido ? 'Definido' : 'No definido',
                year: percentage.status.code == 200 ? percentage.percentage.year : null
            });
            
            
        }

        
        
        return {
            employee: dataEmployee,
            status: status
        };
    }

}
