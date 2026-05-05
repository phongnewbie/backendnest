import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  root() {
    return {
      name: 'ACTA Backend API',
      docs: '/api/docs',
      health: '/health',
    };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }
}
