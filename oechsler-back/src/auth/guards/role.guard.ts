import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from "@nestjs/core";
import { Request } from "express";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly _reflector: Reflector
  ) {}

  async canActivate( context: ExecutionContext): Promise<boolean>  {
    const views: string[] = this._reflector.get<string[]>('views', context.getHandler());
    
    if(!views){
      return true;
    }
    //const hasPermiso = () => views.views.some((role: string) => roles.includes(role)); 

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    let hasRole: boolean = false;
    user.roles.forEach( element => {
        const val = element.vistas.some((vista: string) => views.includes(vista['name']))
        if(val){
          hasRole =  true;
        }
      }
    );
    return user && hasRole; 
  }
}
