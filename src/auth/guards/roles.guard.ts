import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../models/roles.model';
import { PayloadToken } from '../models/token.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    if (!Array.isArray(roles)) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user as PayloadToken;
    if (!user) throw new UnauthorizedException('User doesnt have token');
    const isAuth = roles.includes(user.role as Role);
    if (!isAuth) throw new ForbiddenException('Your role is wrong');
    return isAuth;
  }
}
