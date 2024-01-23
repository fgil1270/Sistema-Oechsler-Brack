import { Injectable, NotFoundException, forwardRef, Inject } from '@nestjs/common';
import { Repository, In, Not, IsNull, Like, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { CreateEmployeeObjectiveDto } from '../dto/create_employee_objective.dto';
import { EmployeeObjective } from '../entities/employee_objective.entity';

@Injectable()
export class EmployeeObjetiveService {

    constructor(
        @InjectRepository(EmployeeObjective) private employeeObjective: Repository<EmployeeObjective>
    ) { }

    async create(currData: CreateEmployeeObjectiveDto){

    }

}
