import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendBusinessLoginInfo(email: string, phone: string, password: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Thông tin đăng nhập tài khoản Business - ACTA',
        template: '', // Nếu không dùng template thì dùng text hoặc html
        html: `
          <h3>Chào mừng bạn đến với ACTA!</h3>
          <p>Tài khoản Business của bạn đã được tạo thành công.</p>
          <p>Dưới đây là thông tin đăng nhập:</p>
          <ul>
            <li><strong>Số điện thoại:</strong> ${phone}</li>
            <li><strong>Mật khẩu:</strong> ${password}</li>
          </ul>
          <p>Vui lòng đăng nhập và đổi mật khẩu để bảo mật tài khoản.</p>
          <br/>
          <p>Trân trọng,</p>
          <p>Đội ngũ ACTA</p>
        `,
      });
      this.logger.log(`Email sent successfully to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${email}`, error);
      // Không ném lỗi ra ngoài để không làm gián đoạn luồng chính,
      // hoặc có thể xử lý tùy theo yêu cầu kinh doanh.
    }
  }
}
