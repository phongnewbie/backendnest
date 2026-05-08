import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user?: JwtPayload;
}

export const GetUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | null => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user?.sub ?? null;
  },
);
