# GitHub Copilot Instructions

## Expertise
You are an expert NestJS backend developer working on this enterprise HR management system.

## Technology Stack
- **Framework**: NestJS (Node.js framework)
- **Language**: TypeScript (strict mode)
- **ORM**: TypeORM
- **Database**: SQL Server
- **Validation**: class-validator, class-transformer
- **Documentation**: @nestjs/swagger (OpenAPI)
- **Authentication**: JWT, Passport

## Architecture Rules

### 1. Modular Architecture
- Follow NestJS modular architecture strictly
- Each feature has its own module with: controller, service, entity, DTO
- Structure: `module/controller/`, `module/service/`, `module/entities/`, `module/dto/`

### 2. Dependency Injection
- Use Dependency Injection strictly - NO manual instantiations
- Inject services via constructor
- Use `@Injectable()` decorator on all services
- Example:
```typescript
@Injectable()
export class MyService {
  constructor(
    @InjectRepository(MyEntity)
    private readonly myRepository: Repository<MyEntity>,
    private readonly otherService: OtherService,
  ) {}
}
```

### 3. DTOs (Data Transfer Objects)
- Use DTOs for ALL endpoints (input/output)
- Apply validation decorators from `class-validator`
- Apply transformation with `class-transformer`
- Use `@ApiProperty()` for Swagger documentation
- Example:
```typescript
export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;
}
```

### 4. Controllers
- Keep controllers thin - delegate logic to services
- Use proper HTTP decorators: `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`
- Document ALL endpoints with `@ApiOperation()`, `@ApiTags()`
- Use `@Body()` for POST/PUT/PATCH, `@Query()` for GET, `@Param()` for route params
- Apply guards: `@UseGuards(AuthGuard('jwt'), RoleGuard)`
- Example:
```typescript
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
```

### 5. Services
- All business logic goes in services
- Use async/await for asynchronous operations
- Return `Promise<T>` or `Observable<T>`
- Handle errors with proper NestJS exceptions
- Example:
```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
```

### 6. Error Handling
- Use built-in NestJS exceptions:
  - `NotFoundException` - Resource not found
  - `BadRequestException` - Invalid input
  - `UnauthorizedException` - Authentication failed
  - `ForbiddenException` - Authorization failed
  - `ConflictException` - Resource conflict
- Create custom `ExceptionFilters` when needed
- Always provide meaningful error messages

### 7. TypeScript Standards
- **NO `any` type** - Use proper types, interfaces, or classes
- Use strict TypeScript mode
- Define interfaces for complex objects
- Use enums for constants
- Leverage type inference when appropriate

### 8. Database (TypeORM)
- Use `@InjectRepository()` for repository injection
- Use `@InjectDataSource()` for direct DataSource access
- Prefer QueryBuilder for complex queries
- Use transactions for multi-step operations
- Always handle database errors
- Example:
```typescript
async findWithRelations(id: number): Promise<Entity> {
  return await this.repository
    .createQueryBuilder('entity')
    .leftJoinAndSelect('entity.relation', 'rel')
    .where('entity.id = :id', { id })
    .getOne();
}
```

### 9. Code Style
- Use Spanish for comments and descriptions (project convention)
- Use English for code (variables, functions, classes)
- Use camelCase for variables and functions
- Use PascalCase for classes and interfaces
- Use UPPER_CASE for constants

### 10. Best Practices
- Validate all input data with DTOs
- Document all endpoints with Swagger
- Use guards for authentication and authorization
- Keep methods focused and small
- Use meaningful variable and function names
- Add comments for complex business logic (in Spanish)
- Follow DRY principle (Don't Repeat Yourself)

## Project-Specific Context
This is an HR management system (Sistema Oechsler) that handles:
- Employee management (empleados)
- Attendance tracking (checador)
- Vacations management (vacaciones)
- Training and courses (capacitación, cursos)
- Production machines (máquinas de producción)
- Incidents and absences (incidencias)
- Organizational structure (organigrama)
- Document management (documentos)
- Performance evaluations (evaluaciones)

## When Writing Code
1. Always follow these NestJS patterns
2. Ensure type safety (no `any`)
3. Add proper validation to DTOs
4. Document with Swagger decorators
5. Handle errors appropriately
6. Use dependency injection
7. Keep services testable and controllers thin
