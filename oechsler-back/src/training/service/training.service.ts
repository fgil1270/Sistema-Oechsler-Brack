import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  UpdateResult,
  DeleteResult,
  IsNull,
  Not,
  Like,
  In,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Training } from '../entities/training.entity';
import { CreateTrainingDto, UpdateTrainingDto, SearchTrainingDto } from '../dto/create-training.dto';
import { EmployeesService } from '../../employees/service/employees.service';
import { TrainingMachineService } from '../../training_machine/service/training-machine.service';
import { HistoryTraining } from '../entities/history-training.entity';


@Injectable()
export class TrainingService {

  constructor(
    @InjectRepository(Training) private trainingRepository: Repository<Training>,
    @InjectRepository(HistoryTraining) private historyTrainingRepository: Repository<HistoryTraining>,
    private readonly employeesService: EmployeesService,
    private readonly trainingMachineService: TrainingMachineService,
  ) { }

  async create(createTrainingDto: CreateTrainingDto) {

    let trainee = await this.employeesService.findOne(createTrainingDto.employeeId);
    let trainer = await this.employeesService.findOne(createTrainingDto.employeeTrainerId);
    let trainingMachine = await this.trainingMachineService.findOne(createTrainingDto.trainingMachineId);
    const training = this.trainingRepository.create({
      start_date: new Date(createTrainingDto.start_date),
      end_date: new Date(createTrainingDto.end_date),
      status: 'Proceso',
    });
    training.employee = trainee.emp;
    training.employeeTrainer = trainer.emp;
    training.trainingMachine = trainingMachine;


    //guardar el entrenamiento
    const savedTraining = await this.trainingRepository.save(training);

    const historyTraining = this.historyTrainingRepository.create({
      start_date: new Date(createTrainingDto.start_date),
      end_date: new Date(createTrainingDto.end_date),
      training: savedTraining,
    });
    historyTraining.trainingMachine = trainingMachine;
    historyTraining.employeeTrainer = trainer.emp;

    //guardar el historial de entrenamiento
    await this.historyTrainingRepository.save(historyTraining);

    return savedTraining;
  }

  findAll(searchTrainingDto: SearchTrainingDto) {
    const { id, status } = searchTrainingDto;

    const where: any = {};

    if (id) {
      where.id = In(id);
    }

    if (status) {
      where.status = In(status);
    }

    return this.trainingRepository.find({
      relations: {
        employee: true,
        employeeTrainer: true,
        trainingMachine: true,
      },
      where
    });
  }

  findOne(id: number) {
    return `This action returns a #id training`;
  }

  //buscar maquinas disponibles para usar
  async findAvailableMachine() {
    const availableTrainings = await this.trainingRepository.find({
      relations: {
        trainingMachine: true,
      },
      where: {
        status: In(['Proceso']),
      }
    });


    // Contar cuántos empleados hay por máquina en entrenamientos activos
    const machineEmployeeCount = new Map<number, number>();

    availableTrainings.forEach((training) => {
      const machineId = training.trainingMachine.id;
      const currentCount = machineEmployeeCount.get(machineId) || 0;
      machineEmployeeCount.set(machineId, currentCount + 1);
    });

    // Obtener todas las máquinas activas
    const allMachines = await this.trainingMachineService.findAll();

    // Filtrar máquinas que no han alcanzado su capacidad máxima
    const availableMachines = allMachines.filter((machine) => {
      const currentEmployees = machineEmployeeCount.get(machine.id) || 0;
      return currentEmployees < machine.total_employees && machine.is_active;
    });

    // Agregar información adicional sobre disponibilidad
    const machinesWithAvailability = availableMachines.map((machine) => {
      const currentEmployees = machineEmployeeCount.get(machine.id) || 0;
      return {
        ...machine,
        current_employees: currentEmployees,
        available_spots: machine.total_employees - currentEmployees,
        utilization_percentage: (currentEmployees / machine.total_employees) * 100
      };
    });

    return {
      available_machines: machinesWithAvailability,
      total_available: machinesWithAvailability.length,
      summary: {
        total_machines: allMachines.length,
        machines_at_capacity: allMachines.length - machinesWithAvailability.length,
        machines_available: machinesWithAvailability.length
      }
    };


  }

  update(id: number, updateTrainingDto: UpdateTrainingDto) {
    return `This action updates a #id training`;
  }

  remove(id: number) {
    return `This action removes a #id training`;
  }
}
