import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'users/entities/user.entity';
import { GqlAuthGuard } from './auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    const ctx = GqlExecutionContext.create(context);
    const email = ctx.getContext().req.user.email;
    const user = await User.findOne({ email });

    if (!roles.includes(user.role)) return false;
    return true;
  }
}

export const Authorize = (roles?: string | string[]) => {
  if (!roles) return UseGuards(GqlAuthGuard);

  return applyDecorators(
    SetMetadata('roles', [roles].flat()),
    UseGuards(GqlAuthGuard, RolesGuard),
  );
};
