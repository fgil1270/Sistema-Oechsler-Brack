# NestJS Expert Rules
- **Architecture**: Always follow the modular architecture of NestJS.
- **Pattern**: Use Dependency Injection strictly. Avoid manual instantiations.
- **Validation**: Use `class-validator` and `class-transformer` in all DTOs.
- **Documentation**: Use `@nestjs/swagger` decorators for all controller endpoints.
- **Error Handling**: Use custom `ExceptionFilters` or standard `HttpException`.
- **Typing**: Strict TypeScript. No `any`. Use interfaces or classes for everything.
- **Async**: Use `async/await` and return `Promise<T>` or `Observable<T>`.