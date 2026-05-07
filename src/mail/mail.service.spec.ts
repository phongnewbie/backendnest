import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailService', () => {
  let service: MailService;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send business login info email', async () => {
    const email = 'test@example.com';
    const phone = '0123456789';
    const password = 'password';

    await service.sendBusinessLoginInfo(email, phone, password);

    expect(mailerService.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: email,
        subject: 'Thông tin đăng nhập tài khoản Business - ACTA',
      }),
    );
  });

  it('should handle mailer service errors gracefully', async () => {
    jest
      .spyOn(mailerService, 'sendMail')
      .mockRejectedValue(new Error('SMTP Error'));
    const email = 'error@example.com';

    // Should not throw
    await expect(
      service.sendBusinessLoginInfo(email, '0123456789', 'password'),
    ).resolves.not.toThrow();
  });
});
