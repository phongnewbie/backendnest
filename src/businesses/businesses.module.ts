import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { MailModule } from '../mail/mail.module';
import { PrismaBusinessesRepository } from './prisma-businesses.repository';

@Module({
  imports: [MailModule],
  controllers: [BusinessesController],
  providers: [
    BusinessesService,
    {
      provide: 'IBUSINESSES_REPOSITORY',
      useClass: PrismaBusinessesRepository,
    },
  ],
  exports: [BusinessesService, 'IBUSINESSES_REPOSITORY'],
})
export class BusinessesModule {}
