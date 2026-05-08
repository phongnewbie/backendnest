import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../guards/jwt-auth.guard';
import { UserRole } from '@prisma/client';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const GetUserRole = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserRole | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user?.role ?? null;
  },
);
